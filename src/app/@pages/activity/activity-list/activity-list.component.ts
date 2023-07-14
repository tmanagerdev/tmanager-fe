import { Component } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivityApiService } from 'src/app/@core/api/activity-api.service';
import { ActivityModalComponent } from '../activity-modal/activity-modal.component';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent {
  activities: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;

  searchFilter = new FormControl('');

  activities$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activityApiService: ActivityApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.activities$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.activityApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.activities = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

    this.searchFilter.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter = val || '';
          this.loadActivities();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadActivities() {
    this.loading = true;
    this.activities = [];
    this.activities$.next();
  }

  onChangePage(event: LazyLoadEvent) {
    this.page = event.first! / event.rows! || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder,
      };
    } else {
      this.sort = null;
    }

    this.loadActivities();
  }

  create() {
    this.ref = this.dialogService.open(ActivityModalComponent, {
      header: `Crea nuova attività`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((newActivity: any) => {
      if (newActivity) {
        const { city, ...activityToSave } = newActivity;
        this.activityApiService
          .create({ ...activityToSave, cityId: city.id })
          .pipe(
            take(1),
            tap((data) => {
              this.loadActivities();
              this.messageService.add({
                severity: 'success',
                summary: 'Attività creata',
                detail: activityToSave.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(activity: any) {
    this.ref = this.dialogService.open(ActivityModalComponent, {
      header: `Aggiorna ${activity.name}`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        activity,
        isEdit: true,
      },
    });

    this.ref.onClose.subscribe((newActivity: any) => {
      if (newActivity) {
        const { city, ...activityToSave } = newActivity;
        this.activityApiService
          .update(activity.id, { ...activityToSave, cityId: city.id })
          .pipe(
            take(1),
            tap((data) => {
              this.loadActivities();
              this.messageService.add({
                severity: 'success',
                summary: 'Attività aggiornata',
                detail: activityToSave.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(activity: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa attività?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.activityApiService
          .delete(activity.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadActivities();
              this.messageService.add({
                severity: 'success',
                summary: 'Attività eliminata',
                detail: activity.name,
              });
            })
          )
          .subscribe();
      },
    });
  }
}

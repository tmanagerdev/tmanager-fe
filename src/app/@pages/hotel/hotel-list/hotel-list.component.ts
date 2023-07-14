import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { HotelModalComponent } from '../hotel-modal/hotel-modal.component';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent {
  hotels: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;

  searchFilter = new FormControl('');

  hotels$: Subject<void> = new Subject();
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
    private hotelApiService: HotelApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.hotels$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.hotelApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.hotels = [...data];
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
          this.loadHotels();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHotels() {
    this.loading = true;
    this.hotels = [];
    this.hotels$.next();
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

    this.loadHotels();
  }

  create() {
    this.ref = this.dialogService.open(HotelModalComponent, {
      header: `Crea nuovo hotel`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((newActivity: any) => {
      if (newActivity) {
        this.hotelApiService
          .create(newActivity)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotels();
              this.messageService.add({
                severity: 'success',
                summary: 'Hotel creato',
                detail: data.email,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(activity: any) {
    this.ref = this.dialogService.open(HotelModalComponent, {
      header: `Aggiorna ${activity.name}`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        activity,
      },
    });

    this.ref.onClose.subscribe((newActivity: any) => {
      if (newActivity) {
        this.hotelApiService
          .update(activity.id, newActivity)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotels();
              this.messageService.add({
                severity: 'success',
                summary: 'Hotel aggiornato',
                detail: newActivity.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(activity: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo hotel?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hotelApiService
          .delete(activity.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadHotels();
              this.messageService.add({
                severity: 'success',
                summary: 'Hotel eliminato',
                detail: activity.name,
              });
            })
          )
          .subscribe();
      },
    });
  }
}

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { VeichleModalComponent } from '../veichle-modal/veichle-modal.component';

@Component({
  selector: 'app-veichle-list',
  templateUrl: './veichle-list.component.html',
  styleUrls: ['./veichle-list.component.scss'],
})
export class VeichleListComponent {
  veichles: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;

  searchFilter = new FormControl('');

  veichles$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private veichleApiService: VeichleApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.veichles$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.veichleApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.veichles = [...data];
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
          this.loadVeichles();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVeichles() {
    this.loading = true;
    this.veichles = [];
    this.veichles$.next();
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

    this.loadVeichles();
  }

  create() {
    this.ref = this.dialogService.open(VeichleModalComponent, {
      header: 'Crea nuovo veicolo',
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((city: any) => {
      if (city) {
        this.veichleApiService
          .create(city)
          .pipe(
            take(1),
            tap(() => {
              this.loadVeichles();
              this.messageService.add({
                severity: 'success',
                summary: 'Veicolo creato',
                detail: city.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(veichle: any) {
    this.ref = this.dialogService.open(VeichleModalComponent, {
      header: `Aggiorna ${veichle.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        veichle,
      },
    });

    this.ref.onClose.subscribe((newVeichle: any) => {
      if (newVeichle) {
        this.veichleApiService
          .update(veichle.id, newVeichle)
          .pipe(
            take(1),
            tap(() => {
              this.loadVeichles();
              this.messageService.add({
                severity: 'success',
                summary: 'Veicolo aggiornato',
                detail: newVeichle.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(newVeichle: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo veicolo?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.veichleApiService
          .delete(newVeichle.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadVeichles();
              this.messageService.add({
                severity: 'success',
                summary: 'Veicolo eliminato',
                detail: newVeichle.name,
              });
            })
          )
          .subscribe();
      },
    });
  }
}

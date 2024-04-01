import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil, switchMap, tap, debounceTime, take } from 'rxjs';
import { ISort } from 'src/app/@core/models/base.model';
import { ServiceApiService } from 'src/app/@core/api/service-api.service';
import { ServiceModalComponent } from '../service-modal/service-modal.component';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent {
  services: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: ISort | null = null;
  loading: boolean = false;

  searchFilter = new FormControl('');

  services$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private serviceApiService: ServiceApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.services$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.serviceApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.services = [...data];
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
          this.loadServices();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadServices() {
    this.loading = true;
    this.services = [];
    this.services$.next();
  }

  onChangePage(event: TableLazyLoadEvent) {
    this.page = event.first! / event.rows! || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder ?? 0,
      };
    } else {
      this.sort = null;
    }

    this.loadServices();
  }

  create() {
    this.ref = this.dialogService.open(ServiceModalComponent, {
      header: 'Crea nuovo servizio',
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((service: any) => {
      if (service) {
        this.serviceApiService
          .create(service)
          .pipe(
            take(1),
            tap(() => {
              this.loadServices();
              this.messageService.add({
                severity: 'success',
                summary: 'Servizio creato',
                detail: service.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(service: any) {
    this.ref = this.dialogService.open(ServiceModalComponent, {
      header: `Aggiorna ${service.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        service,
      },
    });

    this.ref.onClose.subscribe((newservice: any) => {
      if (newservice) {
        this.serviceApiService
          .update(service.id!, newservice)
          .pipe(
            take(1),
            tap(() => {
              this.loadServices();
              this.messageService.add({
                severity: 'success',
                summary: 'Servizio aggiornato',
                detail: newservice.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(service: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo servizio?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.serviceApiService
          .delete(service.id!)
          .pipe(
            take(1),
            tap(() => {
              this.loadServices();
              this.messageService.add({
                severity: 'success',
                summary: 'Servizio eliminato',
                detail: service.name,
              });
            })
          )
          .subscribe();
      },
    });
  }
}

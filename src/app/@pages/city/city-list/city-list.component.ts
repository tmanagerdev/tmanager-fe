import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { CityModalComponent } from '../city-modal/city-modal.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
})
export class CityListComponent implements OnInit {
  cities: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 50;
  filter: string = '';
  sort: any = null;

  searchFilter = new FormControl('');

  cities$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cityApiService: CityApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.cities$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.cityApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.cities = [...data];
          this.totalRecords = total;
        })
      )
      .subscribe();

    this.searchFilter.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter = val || '';
          this.loadCities();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCities() {
    this.cities$.next();
  }

  onChangePage(event: LazyLoadEvent) {
    this.page = event.first || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder,
      };
    } else {
      this.sort = null;
    }

    this.loadCities();
  }

  create() {
    this.ref = this.dialogService.open(CityModalComponent, {
      header: 'Crea nuova città',
      width: '450px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((city: any) => {
      if (city) {
        this.cityApiService
          .create(city)
          .pipe(
            take(1),
            tap(() => {
              this.loadCities();
              this.messageService.add({
                severity: 'success',
                summary: 'Città creata',
                detail: city.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(city: any) {
    this.ref = this.dialogService.open(CityModalComponent, {
      header: `Aggiorna ${city.name}`,
      width: '450px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10001,
      data: {
        city,
      },
    });

    this.ref.onClose.subscribe((newCity: any) => {
      if (newCity) {
        this.cityApiService
          .update(city.id, newCity)
          .pipe(
            take(1),
            tap(() => {
              this.loadCities();
              this.messageService.add({
                severity: 'success',
                summary: 'Città aggiornata',
                detail: newCity.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(city: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa città?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cityApiService
          .delete(city.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadCities();
              this.messageService.add({
                severity: 'success',
                summary: 'Città eliminata',
                detail: city.name,
              });
            })
          )
          .subscribe();
      },
    });
  }
}

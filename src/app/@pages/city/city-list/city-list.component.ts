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
import { ICity } from 'src/app/@core/models/city.model';
import { ISort } from 'src/app/@core/models/base.model';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
})
export class CityListComponent implements OnInit {
  cities: Partial<ICity>[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: ISort | null = null;
  loading: boolean = false;

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
          this.loading = false;
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
    this.loading = true;
    this.cities = [];
    this.cities$.next();
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

    this.loadCities();
  }

  create() {
    this.ref = this.dialogService.open(CityModalComponent, {
      header: 'Crea nuova città',
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((city: Partial<ICity>) => {
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

  update(city: Partial<ICity>) {
    this.ref = this.dialogService.open(CityModalComponent, {
      header: `Aggiorna ${city.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        city,
      },
    });

    this.ref.onClose.subscribe((newCity: Partial<ICity>) => {
      if (newCity) {
        this.cityApiService
          .update(city.id!, newCity)
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

  remove(city: Partial<ICity>) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa città?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cityApiService
          .delete(city.id!)
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

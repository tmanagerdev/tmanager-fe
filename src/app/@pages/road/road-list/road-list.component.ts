import { Component, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { IDropdownFilters, ISort } from 'src/app/@core/models/base.model';
import { ICity } from 'src/app/@core/models/city.model';
import { IRoad } from 'src/app/@core/models/road.model';
import { RoadModalComponent } from '../road-modal/road-modal.component';
import { RoadApiService } from 'src/app/@core/api/road-api.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-road-list',
  templateUrl: './road-list.component.html',
  styleUrls: ['./road-list.component.scss'],
})
export class RoadListComponent {
  roads: Partial<IRoad>[] = [];
  cities: Partial<ICity>[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort?: ISort | null;
  loading: boolean = false;
  filterActive: boolean = false;

  searchFilter = new FormControl('');
  cityFilter = new UntypedFormControl('');

  cities$: Subject<string> = new Subject();
  roads$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  @ViewChild('filters') filtersPopup!: OverlayPanel;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  get cityFilterId() {
    return this.cityFilter.value ? this.cityFilter.value.id : null;
  }

  get filterIcon(): string {
    return this.filterActive ? 'pi pi-filter-fill' : 'pi pi-filter';
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private roadApiService: RoadApiService,
    private cityApiService: CityApiService,
    public dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.roads$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.roadApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { search: this.filter } : {}),
            ...(this.cityFilterId ? { city: this.cityFilterId } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.roads = [...data];
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
          this.loadRoads();
        })
      )
      .subscribe();

    this.cities$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.cityApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.cities = [...data];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRoads() {
    this.loading = true;
    this.roads = [];
    this.roads$.next();
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

    this.loadRoads();
  }

  create() {
    this.ref = this.dialogService.open(RoadModalComponent, {
      header: `Crea nuova tratta`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((newRoad: IRoad) => {
      if (newRoad) {
        const { city, veichle, ...roadToSave } = newRoad;
        this.roadApiService
          .create({ ...roadToSave, cityId: city.id, veichleId: veichle.id })
          .pipe(
            take(1),
            tap(() => {
              this.loadRoads();
              this.messageService.add({
                severity: 'success',
                summary: 'Tratta creata',
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(road: IRoad) {
    this.ref = this.dialogService.open(RoadModalComponent, {
      header: `Aggiorna tratta`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        road,
        isEdit: true,
      },
    });

    this.ref.onClose.subscribe((newRoad: IRoad) => {
      if (newRoad) {
        const { city, veichle, ...roadToSave } = newRoad;
        this.roadApiService
          .update(road.id, {
            ...roadToSave,
            cityId: city.id,
            veichleId: veichle.id,
          })
          .pipe(
            take(1),
            tap((data) => {
              this.loadRoads();
              this.messageService.add({
                severity: 'success',
                summary: 'Tratta aggiornata',
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(road: Partial<IRoad>) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa tratta?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roadApiService
          .delete(road.id!)
          .pipe(
            take(1),
            tap(() => {
              this.loadRoads();
              this.messageService.add({
                severity: 'success',
                summary: 'Tratta eliminata',
              });
            })
          )
          .subscribe();
      },
    });
  }

  applyFilters() {
    this.filterActive = true;
    this.filtersPopup.hide();
    this.loadRoads();
  }

  resetFilters() {
    this.filterActive = false;
    this.cityFilter.setValue(null);
    this.filtersPopup.hide();
    this.loadRoads();
  }

  onFilterCity({ filter }: IDropdownFilters) {
    if (filter) {
      this.loadFilteredCities(filter);
    }
  }

  loadFilteredCities(name: string) {
    this.cities$.next(name);
  }

  teams(road: IRoad) {
    this.router.navigate(['road', road.id, 'teams']);
  }

  veichles(road: IRoad) {
    this.router.navigate(['road', road.id, 'veichles']);
  }
}

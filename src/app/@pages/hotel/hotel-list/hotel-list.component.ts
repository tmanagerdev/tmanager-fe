import { Component, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { HotelModalComponent } from '../hotel-modal/hotel-modal.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent {
  hotels: any[] = [];
  cities: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;
  filterActive: boolean = false;

  searchFilter = new FormControl('');
  cityFilter = new UntypedFormControl('');

  cities$: Subject<string> = new Subject();
  hotels$: Subject<void> = new Subject();
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
    private hotelApiService: HotelApiService,
    private cityApiService: CityApiService,
    private router: Router,
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
            ...(this.cityFilterId ? { city: this.cityFilterId } : {}),
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

  update(hotel: any) {
    this.ref = this.dialogService.open(HotelModalComponent, {
      header: `Aggiorna ${hotel.name}`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: true,
        hotel,
      },
    });

    this.ref.onClose.subscribe((newHotel: any) => {
      if (newHotel) {
        this.hotelApiService
          .update(hotel.id, newHotel)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotels();
              this.messageService.add({
                severity: 'success',
                summary: 'Hotel aggiornato',
                detail: hotel.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(hotel: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo hotel?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hotelApiService
          .delete(hotel.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadHotels();
              this.messageService.add({
                severity: 'success',
                summary: 'Hotel eliminato',
                detail: hotel.name,
              });
            })
          )
          .subscribe();
      },
    });
  }

  rooms(hotel: any) {
    this.router.navigate(['hotel', hotel.id]);
  }

  meals(hotel: any) {
    this.router.navigate(['hotel', hotel.id, 'meals']);
  }

  applyFilters() {
    this.filterActive = true;
    this.filtersPopup.hide();
    this.loadHotels();
  }

  resetFilters() {
    this.filterActive = false;
    this.cityFilter.setValue(null);
    this.filtersPopup.hide();
    this.loadHotels();
  }

  onFilterCity({ filter }: any) {
    if (filter) {
      this.loadFilteredCities(filter);
    }
  }

  loadFilteredCities(name: string) {
    this.cities$.next(name);
  }
}

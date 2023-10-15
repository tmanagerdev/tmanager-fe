import { Component, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { VeichleModalComponent } from '../veichle-modal/veichle-modal.component';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-veichle-list',
  templateUrl: './veichle-list.component.html',
  styleUrls: ['./veichle-list.component.scss'],
})
export class VeichleListComponent {
  veichles: any[] = [];
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

  veichles$: Subject<void> = new Subject();
  cities$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  @ViewChild('filters') filtersPopup!: OverlayPanel;

  get cityFilterId() {
    return this.cityFilter.value ? this.cityFilter.value.id : null;
  }

  get filterIcon(): string {
    return this.filterActive ? 'pi pi-filter-fill' : 'pi pi-filter';
  }
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private veichleApiService: VeichleApiService,
    public dialogService: DialogService,
    private cityApiService: CityApiService,
    private router: Router
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
            ...(this.cityFilterId ? { city: this.cityFilterId } : {}),
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
        isEdit: true,
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

  roads(veichle: any) {
    this.router.navigate(['veichle', veichle.id, 'roads']);
  }

  applyFilters() {
    this.filterActive = true;
    this.filtersPopup.hide();
    this.loadVeichles();
  }

  resetFilters() {
    this.filterActive = false;
    this.cityFilter.setValue(null);
    this.filtersPopup.hide();
    this.loadVeichles();
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

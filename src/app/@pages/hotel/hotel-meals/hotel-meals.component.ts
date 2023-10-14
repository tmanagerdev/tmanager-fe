import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { HotelMealsModalComponent } from './hotel-meals-modal/hotel-meals-modal.component';

@Component({
  selector: 'app-hotel-meals',
  templateUrl: './hotel-meals.component.html',
  styleUrls: ['./hotel-meals.component.scss'],
})
export class HotelMealsComponent {
  hotelId: number = 0;
  hotel: any;
  totalRecords: number = 0;
  loading: boolean = false;

  hotel$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private hotelApiService: HotelApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.hotelId = this.route.snapshot.params['id'];

    this.hotel$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.hotelApiService.findOne(this.hotelId)),
        tap((data) => {
          this.loading = false;
          this.hotel = { ...data };
          this.totalRecords = this.hotel.rooms.length;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadHotel();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadHotel(): void {
    if (this.hotel && this.hotel.rooms) {
      this.hotel.meals = [];
    }
    this.loading = true;
    this.hotel$.next();
  }

  create() {
    this.ref = this.dialogService.open(HotelMealsModalComponent, {
      header: `Crea nuovo pasto`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((newMeal: any) => {
      if (newMeal) {
        this.hotelApiService
          .createMeal(this.hotelId, newMeal)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Pasto aggiunto',
                detail: newMeal.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(meal: any) {
    this.ref = this.dialogService.open(HotelMealsModalComponent, {
      header: `Aggiorna pasto`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: true,
        meal,
      },
    });

    this.ref.onClose.subscribe((newMeal: any) => {
      if (newMeal) {
        this.hotelApiService
          .updateMeal(meal.id, newMeal)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Pasto aggiornato',
                detail: newMeal.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(meal: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo pasto?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hotelApiService
          .deleteMeal(meal.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Pasto eliminato',
                detail: meal.name,
              });
            })
          )
          .subscribe();
      },
    });
  }

  backToHotels() {
    this.router.navigate(['/hotel']);
  }
}

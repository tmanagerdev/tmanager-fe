import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { HotelServiceModalComponent } from './hotel-service-modal/hotel-service-modal.component';

@Component({
  selector: 'app-hotel-service',
  templateUrl: './hotel-service.component.html',
  styleUrls: ['./hotel-service.component.scss'],
})
export class HotelServiceComponent {
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
          this.totalRecords = this.hotel.services.length;
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
      this.hotel.rooms = [];
    }
    this.loading = true;
    this.hotel$.next();
  }

  create() {
    this.ref = this.dialogService.open(HotelServiceModalComponent, {
      header: `Associa servizio`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((service: any) => {
      if (service) {
        this.hotelApiService
          .createService(this.hotelId, service.id)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Servizio aggiunto',
                detail: service.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(service: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler rimuovere questo servizio?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hotelApiService
          .deleteService(this.hotelId, service.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadHotel();
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

  backToHotels() {
    this.router.navigate(['/hotel']);
  }
}

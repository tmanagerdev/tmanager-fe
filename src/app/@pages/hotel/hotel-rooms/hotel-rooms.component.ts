import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { HotelRoomsModalComponent } from './hotel-rooms-modal/hotel-rooms-modal.component';

@Component({
  selector: 'app-hotel-rooms',
  templateUrl: './hotel-rooms.component.html',
  styleUrls: ['./hotel-rooms.component.scss'],
})
export class HotelRoomsComponent {
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
      this.hotel.rooms = [];
    }
    this.loading = true;
    this.hotel$.next();
  }

  create() {
    this.ref = this.dialogService.open(HotelRoomsModalComponent, {
      header: `Crea nuova stanza`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((newRoom: any) => {
      if (newRoom) {
        this.hotelApiService
          .createRoom(this.hotelId, newRoom)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Stanza creata',
                detail: newRoom.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(room: any) {
    this.ref = this.dialogService.open(HotelRoomsModalComponent, {
      header: `Aggiorna stanza`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: true,
        room,
      },
    });

    this.ref.onClose.subscribe((newRoom: any) => {
      if (newRoom) {
        this.hotelApiService
          .updateRoom(this.hotelId, room.id, newRoom)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Stanza aggiornata',
                detail: newRoom.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(room: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa stanza?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.hotelApiService
          .deleteRoom(this.hotelId, room.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Stanza eliminata',
                detail: room.name,
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

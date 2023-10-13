import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  Subject,
  combineLatestWith,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { clearFormArray, uuidv4 } from 'src/app/@core/utils';
import { AccomodationsPeopleModalComponent } from './accomodations-people-modal/accomodations-people-modal.component';
import { CartCreateAccomodationsService } from './cart-create-accomodations.service';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { EStatusCart } from 'src/app/@core/models/cart.model';

@Component({
  selector: 'app-cart-create-accomodations',
  templateUrl: './cart-create-accomodations.component.html',
  styleUrls: ['./cart-create-accomodations.component.scss'],
})
export class CartCreateAccomodationsComponent implements OnInit, OnDestroy {
  _event: any;
  team: number = 0;
  hotels: any = [];
  selectedHotel: any = null;
  coordRoomToDelete: any;
  ref!: DynamicDialogRef;
  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;

  @Input() accomodationForm: FormGroup = new FormGroup({});
  @Input() activeIndex: number = 0;
  @Input() isEdit: boolean = false;
  @Input() set status(value: EStatusCart) {
    if (value) {
      this._status = value;
      if (value !== EStatusCart.DRAFT) {
        this.accomodationForm.get('startDate')?.disable();
        this.accomodationForm.get('endDate')?.disable();
        this.accomodationForm.get('accomodationNotes')?.disable();
      }
    }
  }
  @Input() set event(event: any) {
    this._event = event;
    this.team = event.away.id;
    this.loadHotels();

    if (!this.isEdit) {
      const startDate = new Date(event.date);
      const endDate = new Date(event.date);
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() + 1);
      this.accomodationForm.patchValue({
        startDate,
        endDate,
      });
    }
  }

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  hotel$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get rooms() {
    return this.accomodationForm.get('rooms') as FormArray;
  }

  get roomsValue() {
    return this.accomodationForm.get('rooms')?.value;
  }

  get hotel() {
    return this.accomodationForm.get('hotel') as FormGroup;
  }

  items: MenuItem[] = [
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => {
        const index = this.roomsValue.findIndex(
          (r: any) => r.uuid === this.coordRoomToDelete.uuid
        );
        for (const p of this.rooms.at(index).value.rooming) {
          if (p.people && p.people.id) {
            this.accomodationService.updatePeple(p.people.id, 'REMOVE');
          }
        }
        this.rooms.removeAt(index);
      },
    },
  ];

  constructor(
    private hotelApiService: HotelApiService,
    private cartApiService: CartApiService,
    public dialogService: DialogService,
    private accomodationService: CartCreateAccomodationsService,
    private messageService: MessageService
  ) {
    this.hotel$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          this.hotelApiService.findAll({
            take: 200,
            page: 1,
            city: this._event.home.city.id,
          })
        ),
        map((data) => data.data),
        tap((hotels) => (this.hotels = [...hotels])),
        tap(() => {
          if (this.isEdit) {
            const hotelId = this.accomodationForm.value.hotel.id;
            const hotel = this.hotels.find((h: any) => h.id === hotelId);
            if (hotel) {
              this.selectedHotel = { ...hotel };
            }
          } else {
            if (this.hotel && this.hotel.value && this.hotel.value.id) {
              this.selectedHotel = {
                ...this.hotel.value,
              };
            }
          }
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadHotels() {
    this.hotel$.next();
  }

  populateRoomForm() {
    this.hotel.patchValue({ ...this.selectedHotel });
  }

  onNextStep() {
    this.nextStep.emit();
  }

  onPrevStep() {
    this.prevStep.emit();
  }

  onSelectHotel(hotel: any) {
    if (this._status !== EStatusCart.DRAFT) {
      return;
    }

    clearFormArray(this.rooms);
    if (this.selectedHotel && this.selectedHotel.id === hotel.id) {
      this.selectedHotel = null;
      return;
    } else {
      this.selectedHotel = hotel;
      this.populateRoomForm();
    }
  }

  getRooms(hotelRoom: any) {
    return this.roomsValue.filter((r: any) => r.id === hotelRoom.id);
  }

  onAddNewRoom(hotelRoom: any) {
    const newRoom = new FormGroup({
      id: new FormControl(hotelRoom.id),
      hotelId: new FormControl(this.selectedHotel.id),
      hotelName: new FormControl(this.selectedHotel.name),
      name: new FormControl(hotelRoom.name),
      price: new FormControl(hotelRoom.price),
      numPax: new FormControl(hotelRoom.numPax),
      rooming: new FormArray([]),
      uuid: new FormControl(uuidv4()),
    });
    this.rooms.push(newRoom);
  }

  onRemoveGuest(index: any, room: any) {
    const roomIndex = this.roomsValue.findIndex(
      (r: any) => r.uuid === room.uuid
    );
    const roomGroup = this.rooms.at(roomIndex);
    (roomGroup.get('rooming') as FormArray).removeAt(index);
  }

  onAddGuest(room: any) {
    console.log('room', room);
    this.ref = this.dialogService.open(AccomodationsPeopleModalComponent, {
      header: `Aggiungi ospite`,
      width: '800px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        rooming: room.rooming,
        numPax: room.numPax,
      },
    });
    this.ref.onClose.subscribe((people: any) => {
      if (people) {
        const roomIndex = this.roomsValue.findIndex(
          (r: any) => r.uuid === room.uuid
        );
        const roomGroup = this.rooms.at(roomIndex);

        clearFormArray(roomGroup.get('rooming') as FormArray);

        for (const p of people) {
          const newPeople = new FormGroup({
            people: new FormGroup({
              id: new FormControl(p.id ? p.id : null),
              name: new FormControl(p.id ? p.name : null),
              surname: new FormControl(p.id ? p.surname : null),
              category: new FormControl(p.id ? p.category : null),
            }),
            name: new FormControl(!p.id ? p.name : null),
            surname: new FormControl(!p.id ? p.surname : null),
            category: new FormControl(!p.id ? p.category : null),
          });
          (roomGroup.get('rooming') as FormArray).push(newPeople);
        }
      }
    });
  }

  onToggleMenu(room: any, menu: any, event: any) {
    this.coordRoomToDelete = room;
    menu.toggle(event);
  }

  onCloneLast() {
    this.cartApiService
      .copyLastRooming(this.team)
      .pipe(
        take(1),
        combineLatestWith(this.accomodationService.people$),
        tap(([{ data }, people]) => {
          clearFormArray(this.rooms);
          for (const d of data) {
            const room = this.selectedHotel.rooms.find(
              (r: any) => r.name === d.roomName
            );
            const newRoom = new FormGroup({
              id: new FormControl(room.id),
              hotelId: new FormControl(this.selectedHotel.id),
              hotelName: new FormControl(this.selectedHotel.name),
              name: new FormControl(room.name),
              price: new FormControl(room.price),
              numPax: new FormControl(room.numPax),
              rooming: new FormArray([]),
              uuid: new FormControl(uuidv4()),
            });

            for (let p of d.people) {
              if (p.peopleId) {
                p = people.find((person: any) => person.id === p.peopleId);
              }
              const newPeople = new FormGroup({
                people: new FormGroup({
                  id: new FormControl(p.id ? p.id : null),
                  name: new FormControl(p.id ? p.name : null),
                  surname: new FormControl(p.id ? p.surname : null),
                  category: new FormControl(p.id ? p.category : null),
                }),
                name: new FormControl(!p.id ? p.name : null),
                surname: new FormControl(!p.id ? p.surname : null),
                category: new FormControl(!p.id ? p.category : null),
              });
              (newRoom.get('rooming') as FormArray).push(newPeople);
            }

            this.rooms.push(newRoom);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Rooming copiata da ultima trasferta',
          });
        })
      )
      .subscribe();
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { clearFormArray, uuidv4 } from 'src/app/@core/utils';
import { AccomodationsPeopleModalComponent } from './accomodations-people-modal/accomodations-people-modal.component';
import { PeopleRoomingService } from '../people-rooming.service';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-cart-create-accomodations',
  templateUrl: './cart-create-accomodations.component.html',
  styleUrls: ['./cart-create-accomodations.component.scss'],
})
export class CartCreateAccomodationsComponent implements OnInit, OnDestroy {
  _event: any;
  team: number = 0;
  _hotels: any = [];
  filteredHotels: any = [];
  //selectedHotel: any = null;
  coordRoomToDelete: any;
  ref!: DynamicDialogRef;
  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;
  filtersService: any;

  @Input() selectedHotel: any = null;
  @Input() accomodationForm: FormGroup = new FormGroup({});
  //@Input() mealForm: FormGroup = new FormGroup({});
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
  @Input() set hotels(hotels: any) {
    if (hotels && hotels.length) {
      this._hotels = [...hotels];
      this.filteredHotels = [...hotels];
    }
  }
  @Input() services: any = [];

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();
  @Output() changeSelectedHotel: EventEmitter<any> = new EventEmitter();

  @ViewChild('filters') filtersPopup!: OverlayPanel;

  hotel$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get rooms() {
    return this.accomodationForm.get('rooms') as FormArray;
  }

  get roomsValue() {
    return this.accomodationForm.get('rooms')?.value;
  }

  // get hotel() {
  //   return this.accomodationForm.get('hotel') as FormGroup;
  // }

  items: MenuItem[] = [
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => {
        const index = this.roomsValue.findIndex(
          (r: any) => r.uuid === this.coordRoomToDelete.uuid
        );
        for (const p of this.rooms.at(index).value.rooming) {
          if (p) {
            this.peopleRoomingService.updateRooming(p, 'REMOVE');
          }
        }
        this.rooms.removeAt(index);
      },
    },
  ];

  constructor(
    public dialogService: DialogService,
    private peopleRoomingService: PeopleRoomingService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadHotels() {
    this.hotel$.next();
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

    this.selectedHotel =
      this.selectedHotel && this.selectedHotel.id === hotel.id ? null : hotel;
    this.changeSelectedHotel.emit(hotel);
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

        console.log('people', people);

        for (const p of people) {
          const newPeople = new FormGroup({
            name: new FormControl(p.name ?? null),
            surname: new FormControl(p.surname ?? null),
            category: new FormControl(p.category ?? null),
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

  applyFilters() {
    this.selectedHotel = null;
    this.filtersPopup.hide();

    this.filteredHotels = [
      ...this._hotels.filter((h: any) =>
        h.services.some((hs: any) =>
          this.filtersService.some((fs: any) => fs.id === hs.service.id)
        )
      ),
    ];
  }

  resetFilters() {
    this.selectedHotel = null;
    this.filtersService = null;
    this.filteredHotels = [...this._hotels];
    this.filtersPopup.hide();
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject, map, switchMap, takeUntil, tap } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { clearFormArray } from 'src/app/@core/utils';

@Component({
  selector: 'app-cart-create-accomodations',
  templateUrl: './cart-create-accomodations.component.html',
  styleUrls: ['./cart-create-accomodations.component.scss'],
})
export class CartCreateAccomodationsComponent implements OnInit, OnDestroy {
  _event: any;
  hotels: any = [];
  selectedHotel: any = null;

  @Input() accomodationForm: FormGroup = new FormGroup({});
  @Input() activeIndex: number = 0;
  @Input() isEdit: boolean = false;
  @Input() set event(event: any) {
    this._event = event;
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

  constructor(private hotelApiService: HotelApiService) {
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
            console.log('cerco hotel');
            const hotelId = this.accomodationForm.value.hotel.id;
            const hotel = this.hotels.find((h: any) => h.id === hotelId);
            if (hotel) {
              this.selectedHotel = { ...hotel };
              this.selectedHotel.rooms.forEach((room: any) => {
                const alreadyExists = this.rooms.value.find(
                  (r: any) => r.id === room.id
                );
                if (!alreadyExists) {
                  this.rooms.push(
                    new FormGroup({
                      id: new FormControl(room.id),
                      name: new FormControl(room.name),
                      price: new FormControl(room.price),
                      quantity: new FormControl(null),
                      hotelId: new FormControl(this.selectedHotel.id),
                      hotelName: new FormControl(this.selectedHotel.name),
                    })
                  );
                }
              });
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
    this.selectedHotel.rooms.forEach((room: any) => {
      this.rooms.push(
        new FormGroup({
          id: new FormControl(room.id),
          name: new FormControl(room.name),
          price: new FormControl(room.price),
          quantity: new FormControl(null),
          hotelId: new FormControl(this.selectedHotel.id),
          hotelName: new FormControl(this.selectedHotel.name),
        })
      );
    });
  }

  onNextStep() {
    this.nextStep.emit();
  }

  onPrevStep() {
    this.prevStep.emit();
  }

  onSelectHotel(hotel: any) {
    clearFormArray(this.rooms);
    if (this.selectedHotel && this.selectedHotel.id === hotel.id) {
      this.selectedHotel = null;
      return;
    } else {
      this.selectedHotel = hotel;
      this.populateRoomForm();
    }
  }
}

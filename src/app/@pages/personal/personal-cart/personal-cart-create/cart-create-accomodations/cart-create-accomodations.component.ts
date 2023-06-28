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

  @Input() activeIndex: number = 0;
  @Input() set event(event: any) {
    this._event = event;
    this.loadHotels();
  }
  @Input() accomodationForm: FormGroup = new FormGroup({});

  @Output() nextStep: EventEmitter<number> = new EventEmitter();
  @Output() prevStep: EventEmitter<number> = new EventEmitter();

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
            city: this._event.home.cityId,
          })
        ),
        map((data) => data.data),
        tap((hotels) => (this.hotels = [...hotels]))
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
        })
      );
    });
  }

  onNextStep() {
    this.nextStep.emit(this.activeIndex);
  }

  onPrevStep() {
    this.prevStep.emit(this.activeIndex);
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

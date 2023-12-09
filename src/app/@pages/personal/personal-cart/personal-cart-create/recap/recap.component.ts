import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { EStatusCart } from 'src/app/@core/models/cart.model';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
})
export class RecapComponent implements OnInit {
  @Input() set cartForm(form: FormGroup) {
    this._cartForm = form;

    this.totalPax =
      this.cartForm?.get('players')?.value +
      this.cartForm?.get('staffs')?.value +
      this.cartForm?.get('managers')?.value +
      this.cartForm?.get('equipments')?.value +
      this.cartForm?.get('others')?.value;
    this.rooms = this.cartForm
      ?.get('rooms')
      ?.value.reduce((group: any, room: any) => {
        const { name, price } = room;
        const index = group.findIndex((g: any) => g.name === name);
        if (index > -1) {
          group[index].quantity++;
        } else {
          group.push({ name, price, quantity: 1 });
        }
        return group;
      }, []);

    this.meals = this.cartForm
      ?.get('meals')
      ?.value.reduce((group: any, meal: any) => {
        const {
          quantity,
          startDate,
          description,
          price,
          configId,
          mealId,
          name,
        } = meal;

        const index = group.findIndex((g: any) => g.mealId === mealId);
        if (index > -1) {
          group[index].configIds.push({ configId });
        } else {
          group.push({
            mealId,
            name,
            configIds: [{ configId }],
            quantity,
            startDate,
            description,
            price,
          });
        }
        return group;
      }, []);

    this.roads = this.cartForm?.get('roads')?.value;

    const totalAccomodation = this.rooms.reduce((acc: any, room: any) => {
      return acc + room.price * room.quantity * 100;
    }, 0);
    const totalActivity = this.activities.value.reduce(
      (acc: any, activity: any) => {
        return acc + activity.quantity * activity.price * 100;
      },
      0
    );
    const totalRoads = this.cartForm
      ?.get('roads')
      ?.value.reduce((acc: any, road: any) => {
        return acc + road.price * road.quantity * 100;
      }, 0);

    const totalMeal = this.meals.reduce((acc: any, meal: any) => {
      return acc + meal.quantity * meal.price * 100;
    }, 0);

    this.total =
      totalAccomodation / 100 +
      totalActivity / 100 +
      totalRoads / 100 +
      totalMeal / 100;

    this.cartForm.patchValue({ total: this.total });
  }

  @Input() activeIndex: number = 0;
  @Input() set status(value: EStatusCart) {
    if (value) {
      this._status = value;
      if (value !== EStatusCart.DRAFT) {
        this.genericNotes.disable();
      }
    }
  }

  @Output() nextStep: EventEmitter<number> = new EventEmitter();
  @Output() prevStep: EventEmitter<number> = new EventEmitter();

  messages: Message[] | undefined;
  totalPax: number = 0;
  rooms: any[] = [];
  roads: any[] = [];
  meals: any[] = [];
  total: number = 0;
  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;

  _cartForm: FormGroup = new FormGroup({});

  get cartForm(): FormGroup {
    return this._cartForm;
  }

  get awayTeam() {
    return this.cartForm?.get('team')?.value;
  }

  get homeTeam() {
    return this.cartForm?.get('event')?.get('home')?.value;
  }

  get city() {
    return this.cartForm?.get('event')?.get('home')?.get('city')?.value;
  }

  get eventDate() {
    return this.cartForm?.get('event')?.get('date')?.value;
  }

  get hotel() {
    return this.cartForm?.get('rooms')?.value[0]?.hotelName;
  }

  get activities() {
    return this.cartForm?.get('activities') as FormArray;
  }

  get genericNotes() {
    return this.cartForm?.get('genericNotes') as FormControl;
  }

  constructor() {}

  ngOnInit() {
    this.messages = [
      {
        severity: 'info',
        summary: 'Ci siamo quasi!',
        detail:
          'Ricontrolla tutti i dati inseriti a aggiungi delle note extra se necessario',
      },
    ];
  }

  onNextStep() {
    this.nextStep.emit(this.activeIndex);
  }

  onPrevStep() {
    this.prevStep.emit(this.activeIndex);
  }
}

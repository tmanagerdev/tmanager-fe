import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { compareDates } from 'src/app/@core/utils';

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
      this.cartForm?.get('managers')?.value;
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

    const totalAccomodation = this.rooms.reduce((acc: any, room: any) => {
      return acc + room.price * room.quantity * 100;
    }, 0);
    const totalActivity = this.activities.value.reduce(
      (acc: any, activity: any) => {
        return acc + activity.price * 100;
      },
      0
    );
    const totalRoads = this.cartForm
      ?.get('roads')
      ?.value.reduce((acc: any, road: any) => {
        return acc + road.price * road.quantity * 100;
      }, 0);

    this.total =
      totalAccomodation / 100 + totalActivity / 100 + totalRoads / 100;

    this.roads = this.cartForm
      ?.get('roads')
      ?.value.reduce((group: any, road: any) => {
        const index = group.findIndex((g: any) =>
          g.data.some((el: any) => !compareDates(el.startDate, road.startDate))
        );
        if (index > -1) {
          group[index].data.push(road);
        } else {
          group.push({ date: road.startDate, data: [road] });
        }
        return group;
      }, []);
  }
  @Input() activeIndex: number = 0;

  @Output() nextStep: EventEmitter<number> = new EventEmitter();
  @Output() prevStep: EventEmitter<number> = new EventEmitter();

  messages: Message[] | undefined;
  totalPax: number = 0;
  rooms: any[] = [];
  roads: any[] = [];
  total: number = 0;

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
          'Ricontrolla tutti i dati inseriti a aggiungi delle note sulle attività se necessario',
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

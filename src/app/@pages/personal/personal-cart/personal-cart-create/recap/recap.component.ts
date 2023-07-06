import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.component.html',
  styleUrls: ['./recap.component.scss'],
})
export class RecapComponent implements OnInit {
  @Input() cartForm: FormGroup = new FormGroup({});
  @Input() activeIndex: number = 0;

  @Output() nextStep: EventEmitter<number> = new EventEmitter();
  @Output() prevStep: EventEmitter<number> = new EventEmitter();

  messages: Message[] | undefined;

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

  get totalPax() {
    return (
      this.cartForm?.get('players')?.value +
      this.cartForm?.get('staffs')?.value +
      this.cartForm?.get('managers')?.value
    );
  }

  get hotel() {
    return this.cartForm?.get('rooms')?.value[0]?.hotelName;
  }

  get rooms() {
    return this.cartForm?.get('rooms')?.value;
  }

  get roads() {
    return this.cartForm?.get('roads')?.value;
  }

  get activities() {
    return this.cartForm?.get('activities') as FormArray;
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
    console.log('prev step');
    this.prevStep.emit(this.activeIndex);
  }
}

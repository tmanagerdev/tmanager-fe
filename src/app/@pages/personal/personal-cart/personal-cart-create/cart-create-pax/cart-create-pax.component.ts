import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart-create-pax',
  templateUrl: './cart-create-pax.component.html',
  styleUrls: ['./cart-create-pax.component.scss'],
})
export class CartCreatePaxComponent {
  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() paxForm: FormGroup = new FormGroup({});

  @Output() nextStep: EventEmitter<void> = new EventEmitter();

  get totalPax() {
    const players = this.paxForm.get('players')?.value ?? 0;
    const staffs = this.paxForm.get('staffs')?.value ?? 0;
    const managers = this.paxForm.get('managers')?.value ?? 0;
    return players + staffs + managers;
  }

  constructor() {}

  onNextStep() {
    this.nextStep.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EStatusCart } from 'src/app/@core/models/cart.model';

@Component({
  selector: 'app-cart-create-pax',
  templateUrl: './cart-create-pax.component.html',
  styleUrls: ['./cart-create-pax.component.scss'],
})
export class CartCreatePaxComponent {
  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() paxForm: FormGroup = new FormGroup({});
  @Input() set status(value: EStatusCart) {
    if (value && value !== EStatusCart.DRAFT) {
      this.paxForm.get('players')?.disable();
      this.paxForm.get('staffs')?.disable();
      this.paxForm.get('managers')?.disable();
      this.paxForm.get('equipments')?.disable();
      this.paxForm.get('others')?.disable();
    }
  }

  @Output() nextStep: EventEmitter<void> = new EventEmitter();

  get totalPax() {
    const players = this.paxForm.get('players')?.value ?? 0;
    const staffs = this.paxForm.get('staffs')?.value ?? 0;
    const managers = this.paxForm.get('managers')?.value ?? 0;
    const equipments = this.paxForm.get('equipments')?.value ?? 0;
    const others = this.paxForm.get('others')?.value ?? 0;
    return players + staffs + managers + equipments + others;
  }

  constructor() {}

  onNextStep() {
    this.nextStep.emit();
  }
}

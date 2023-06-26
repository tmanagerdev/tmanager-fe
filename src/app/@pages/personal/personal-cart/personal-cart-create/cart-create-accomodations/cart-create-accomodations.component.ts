import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart-create-accomodations',
  templateUrl: './cart-create-accomodations.component.html',
  styleUrls: ['./cart-create-accomodations.component.scss'],
})
export class CartCreateAccomodationsComponent {
  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() accomodationForm: FormGroup = new FormGroup({});

  @Output() nextStep: EventEmitter<number> = new EventEmitter();
  @Output() prevStep: EventEmitter<number> = new EventEmitter();

  onNextStep() {
    this.nextStep.emit(this.activeIndex);
  }

  onPrevStep() {
    console.log('emit prev');
    this.prevStep.emit(this.activeIndex);
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-quantity-dropdown',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quantity-dropdown.component.html',
  styleUrls: ['./quantity-dropdown.component.scss'],
})
export class QuantityDropdownComponent {
  @Input() control: AbstractControl = new FormControl();
  @Input() forPax = false;
  @Input() set max(value: number) {
    this._max = value ?? 30;
    this.options = [...Array(this._max).keys()]
      .sort((a, b) => b - a)
      .map((x) => x + 1);
  }

  private _max = 30;
  options: number[] = [];

  get max() {
    return this._max;
  }

  get controlFC() {
    return this.control as FormControl;
  }

  constructor() {}
}

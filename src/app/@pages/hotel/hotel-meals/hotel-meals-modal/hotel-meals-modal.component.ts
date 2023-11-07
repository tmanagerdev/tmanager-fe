import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-hotel-meals-modal',
  templateUrl: './hotel-meals-modal.component.html',
  styleUrls: ['./hotel-meals-modal.component.scss'],
})
export class HotelMealsModalComponent {
  meal: any;
  isEdit: boolean = false;

  mealForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    custom: new FormControl(false),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.meal = this.config.data.meal;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.mealForm.patchValue(this.meal);
      }
    }
  }

  onSave() {
    if (this.mealForm.valid) {
      const meal = { ...this.mealForm.value };
      this.ref.close(meal);
    }
  }
}

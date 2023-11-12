import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IMeal } from 'src/app/@core/models/meal.model';

@Component({
  selector: 'app-meal-modal',
  templateUrl: './meal-modal.component.html',
  styleUrls: ['./meal-modal.component.scss'],
})
export class MealModalComponent {
  meal: Partial<IMeal> = {};
  isEdit: boolean = false;

  mealForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(null),
    maxConfigActive: new FormControl(null),
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
      const meal = this.mealForm.value;
      this.ref.close(meal);
    }
  }
}

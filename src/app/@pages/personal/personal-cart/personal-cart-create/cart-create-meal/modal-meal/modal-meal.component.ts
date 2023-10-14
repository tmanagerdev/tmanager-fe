import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-meal',
  templateUrl: './modal-meal.component.html',
  styleUrls: ['./modal-meal.component.scss'],
})
export class ModalMealComponent {
  mealForm: FormGroup = new FormGroup({
    startDate: new FormControl(null),
    startDateHour: new FormControl(null),
    quantity: new FormControl(1),
    id: new FormControl(null),
    name: new FormControl(null),
  });
  isEdit: boolean = false;
  index: number = 0;
  mealsList: any = [];

  mealControl = new FormControl();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      const { mealForm, mealsList, index, isEdit } = this.config.data;
      this.mealForm = mealForm;
      this.mealsList = mealsList;
      this.index = index;
      this.isEdit = isEdit;

      if (this.isEdit) {
        const meal = this.mealForm.value;
        const startDateHour = new Date(meal.startDate);
        startDateHour.setHours(
          new Date(meal.startDate).getHours(),
          new Date(meal.startDate).getMinutes()
        );

        this.mealForm.addControl(
          'startDateHour',
          new FormControl(startDateHour)
        );

        this.mealControl.setValue({
          id: meal.id,
          name: meal.name,
        });
      }
    }
  }

  onSave() {
    const { name, id } = this.mealControl.value;

    const meal = this.mealForm.value;
    const startDateHour = new Date(meal.startDateHour).getHours();
    const startDateMinute = new Date(meal.startDateHour).getMinutes();
    const startDate = new Date(meal.startDate);
    startDate.setHours(startDateHour, startDateMinute);
    this.mealForm.patchValue({ ...meal, startDate, name, id });

    console.log(this.mealForm.value);
    this.ref.close(this.mealForm);
  }
}

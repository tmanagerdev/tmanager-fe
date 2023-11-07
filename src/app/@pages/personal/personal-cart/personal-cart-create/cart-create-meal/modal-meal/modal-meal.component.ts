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
    description: new FormControl(null),
    custom: new FormControl(false),
  });
  isEdit: boolean = false;
  index: number = 0;
  mealsList: any = [];
  isCustom = false;

  mealControl = new FormControl();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      const { mealForm, mealsList, index, isEdit } = this.config.data;
      this.mealForm = mealForm;
      console.log('this.mealForm', this.mealForm);
      this.mealsList = mealsList;
      console.log('this.mealsList', this.mealsList);
      this.index = index;
      this.isEdit = isEdit;

      if (this.isEdit) {
        const meal = this.mealForm.value;
        console.log('meal', meal);
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
          custom: meal.custom,
        });

        this.isCustom = meal.custom;
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
    this.mealForm.patchValue({
      ...meal,
      startDate,
      name,
      id,
      custom: this.isCustom,
    });

    console.log(this.mealForm.value);
    this.ref.close(this.mealForm);
  }

  onChangeMeal({ value }: any) {
    console.log('value', value);
    this.isCustom = value.custom;
  }
}

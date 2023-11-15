import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-modal-meal',
  templateUrl: './modal-meal.component.html',
  styleUrls: ['./modal-meal.component.scss'],
})
export class ModalMealComponent {
  mealForm: FormGroup = new FormGroup({});
  isEdit: boolean = false;
  index: number = 0;
  maxPax: number = 0;
  mealsList: any = [];
  isCustom = false;
  private destroyRef = inject(DestroyRef);
  selectedMeal: any;
  selectedConfig: any;

  get mealIdControl() {
    return this.mealForm.get('mealId') as FormControl;
  }
  get configIdControl() {
    return this.mealForm.get('configId') as FormControl;
  }

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      const { mealForm, mealsList, index, isEdit, maxPax } = this.config.data;
      this.mealForm = mealForm;
      this.mealsList = mealsList;
      this.index = index;
      this.maxPax = maxPax;
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

        if (this.mealIdControl.value) {
          this.selectedMeal = this.mealsList.find(
            (ml: any) => ml.id === this.mealIdControl.value
          );
        }

        if (this.configIdControl.value) {
          this.selectedConfig = this.selectedMeal.mealConfigs.find(
            (mc: any) => mc.id === this.configIdControl.value
          );
        }
      }
    }

    this.mealIdControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((v) => {
          this.selectedConfig = null;
          this.configIdControl.reset();
          if (v) {
            this.selectedMeal = this.mealsList.find((ml: any) => ml.id === v);
          } else {
            this.selectedMeal = null;
          }
        })
      )
      .subscribe();

    this.configIdControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((v) => {
          if (v && this.selectedMeal) {
            this.selectedConfig = this.selectedMeal.mealConfigs.find(
              (mc: any) => mc.id === v
            );
          } else {
            this.selectedConfig = null;
          }
        })
      )
      .subscribe();
  }

  onSave() {
    console.log('this.mealForm.value', this.mealForm.value);
    // const { name, id } = this.mealControl.value;
    const meal = this.mealForm.value;
    const startDateHour = new Date(meal.startDateHour).getHours();
    const startDateMinute = new Date(meal.startDateHour).getMinutes();
    const startDate = new Date(meal.startDate);
    startDate.setHours(startDateHour, startDateMinute);
    this.mealForm.patchValue({
      ...meal,
      name: `${this.selectedMeal.name} - ${this.selectedConfig.name}`,
    });
    console.log(this.mealForm.value);
    this.ref.close(this.mealForm);
  }
}

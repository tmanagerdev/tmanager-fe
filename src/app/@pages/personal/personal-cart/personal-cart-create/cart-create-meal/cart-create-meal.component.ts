import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalMealComponent } from './modal-meal/modal-meal.component';

@Component({
  selector: 'app-cart-create-meal',
  templateUrl: './cart-create-meal.component.html',
  styleUrls: ['./cart-create-meal.component.scss'],
})
export class CartCreateMealComponent {
  ref!: DynamicDialogRef;

  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() meals: any[] = [];
  @Input() mealForm: FormGroup = new FormGroup({});
  @Input() maxPax = 0;
  @Input() isEdit: boolean = false;
  @Input() isDisabledCart: boolean = false;

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  get mealsArray(): FormArray {
    return this.mealForm.get('meals') as FormArray;
  }

  get mealsValue(): any {
    return this.mealForm.get('meals')?.value;
  }

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  onNextStep() {
    this.nextStep.emit();
  }

  onPrevStep() {
    this.prevStep.emit();
  }

  onUpdateMeal(index: number) {
    const mealToUpdate = this.mealsArray.at(index) as FormGroup;
    console.log('mealToUpdate', mealToUpdate);

    this.ref = this.dialogService.open(ModalMealComponent, {
      header: 'Aggiorna pasto',
      width: '700px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        mealForm: mealToUpdate,
        isEdit: true,
        index: index + 1,
        mealsList: this.meals,
        maxPax: this.maxPax,
      },
    });

    this.ref.onClose.subscribe((meal: FormGroup) => {
      if (meal) {
        console.log('save??', meal.value);
        this.mealsArray.at(index).setValue({ ...meal.value });
      }
    });
  }

  onDeleteMeal(index: number) {
    this.mealsArray.removeAt(index);
  }

  onAddMeal() {
    console.log('add meal', this.meals);
    const startDate = new Date(this.event.date);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    const newMeal = new FormGroup({
      startDate: new FormControl(startDate),
      startDateHour: new FormControl(startDate),
      quantity: new FormControl(this.maxPax),
      id: new FormControl(null),
      name: new FormControl(null),
      mealId: new FormControl(null, Validators.required),
      configId: new FormControl(null),
      configIds: new FormControl([]),
      description: new FormControl(null),
      price: new FormControl(null),
    });

    this.ref = this.dialogService.open(ModalMealComponent, {
      header: 'Aggiungi nuovo pasto',
      width: '700px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: false,
        mealForm: newMeal,
        index: this.mealsArray.length + 1,
        mealsList: this.meals,
        maxPax: this.maxPax,
      },
    });

    this.ref.onClose.subscribe((meal: FormGroup) => {
      if (meal) {
        this.mealsArray.push(meal);
      }
    });
  }
}

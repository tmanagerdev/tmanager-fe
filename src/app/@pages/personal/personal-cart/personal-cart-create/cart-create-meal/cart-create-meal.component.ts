import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { ModalMealComponent } from './modal-meal/modal-meal.component';

@Component({
  selector: 'app-cart-create-meal',
  templateUrl: './cart-create-meal.component.html',
  styleUrls: ['./cart-create-meal.component.scss'],
})
export class CartCreateMealComponent {
  ref!: DynamicDialogRef;
  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;

  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() hotelMeals: FormGroup = new FormGroup({});
  @Input() mealForm: FormGroup = new FormGroup({});
  @Input() set status(value: EStatusCart) {
    if (value) {
      this._status = value;
    }
  }

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  get meals(): FormArray {
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
    const mealToUpdate = this.meals.at(index) as FormGroup;

    this.ref = this.dialogService.open(ModalMealComponent, {
      header: 'Aggiorna pasto',
      width: '700px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        mealForm: mealToUpdate,
        isEdit: true,
        index: index + 1,
        mealsList: this.hotelMeals,
      },
    });

    this.ref.onClose.subscribe((meal: FormGroup) => {
      if (meal) {
        this.meals.at(index).setValue({ ...meal.value });
      }
    });
  }

  onDeleteMeal(index: number) {
    this.meals.removeAt(index);
  }

  onAddMeal() {
    const startDate = new Date(this.event.date);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    const newMeal = new FormGroup({
      startDate: new FormControl(startDate),
      startDateHour: new FormControl(startDate),
      quantity: new FormControl(1),
      id: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      custom: new FormControl(false),
    });

    this.ref = this.dialogService.open(ModalMealComponent, {
      header: 'Aggiungi nuovo pasto',
      width: '700px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: false,
        mealForm: newMeal,
        index: this.meals.length + 1,
        mealsList: this.hotelMeals,
      },
    });

    this.ref.onClose.subscribe((meal: FormGroup) => {
      if (meal) {
        this.meals.push(meal);
      }
    });
  }
}

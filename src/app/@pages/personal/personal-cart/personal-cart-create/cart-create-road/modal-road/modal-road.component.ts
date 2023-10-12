import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-road',
  templateUrl: './modal-road.component.html',
  styleUrls: ['./modal-road.component.scss'],
})
export class ModalRoadComponent {
  roadForm: FormGroup = new FormGroup({
    startDate: new FormControl(null),
    startDateHour: new FormControl(null),
    veichle: new FormControl(null),
    quantity: new FormControl(1),
    id: new FormControl(null),
    price: new FormControl(null),
    from: new FormControl(null),
    to: new FormControl(null),
    veichleId: new FormControl(null),
    createdAt: new FormControl(null),
    updatedAt: new FormControl(null),
  });
  isEdit: boolean = false;
  index: number = 0;
  veichlesList: any = [];

  veichleControl = new FormControl();

  get veichles() {
    return this.roadForm.get('veichles') as FormArray;
  }
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      const { roadForm, veichlesList, index, isEdit } = this.config.data;
      this.roadForm = roadForm;
      console.log(veichlesList);
      this.veichlesList = veichlesList;
      this.index = index;
      this.isEdit = isEdit;

      if (this.isEdit) {
        const road = this.roadForm.value;
        console.log('road', road);
        const startDateHour = new Date(road.startDate);
        startDateHour.setHours(
          new Date(road.startDate).getHours(),
          new Date(road.startDate).getMinutes()
        );

        this.roadForm.addControl(
          'startDateHour',
          new FormControl(startDateHour)
        );

        this.veichleControl.setValue({
          veichle: road.veichle,
          id: road.id,
          price: road.price,
          from: road.from,
          to: road.to,
          veichleId: road.veichleId,
          createdAt: road.createdAt,
          updatedAt: road.updatedAt,
        });

        console.log('settato', this.veichleControl.value);
      }
    }
  }

  onSave() {
    const veichle = this.veichleControl.value;

    console.log('on save veichle', veichle);

    const road = this.roadForm.value;
    const startDateHour = new Date(road.startDateHour).getHours();
    const startDateMinute = new Date(road.startDateHour).getMinutes();
    const startDate = new Date(road.startDate);
    startDate.setHours(startDateHour, startDateMinute);
    this.roadForm.patchValue({ startDate, ...veichle });

    console.log(this.roadForm.value);
    this.ref.close(this.roadForm);
  }
}

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
    road: new FormControl(null),
    createdAt: new FormControl(null),
    updatedAt: new FormControl(null),
  });
  isEdit: boolean = false;
  index: number = 0;
  veichlesList: any = [];
  roadsList: any = [];

  veichleControl = new FormControl();
  roadControl = new FormControl();

  get veichles() {
    return this.roadForm.get('veichles') as FormArray;
  }
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      const { roadForm, veichlesList, index, isEdit, roadsList } =
        this.config.data;
      this.roadForm.patchValue({ ...roadForm.value });
      this.veichlesList = veichlesList;
      this.roadsList = roadsList;
      this.index = index;
      this.isEdit = isEdit;

      if (this.isEdit) {
        const formValue = this.roadForm.value;
        const startDateHour = new Date(formValue.startDate);
        startDateHour.setHours(
          new Date(formValue.startDate).getHours(),
          new Date(formValue.startDate).getMinutes()
        );

        this.roadForm.get('startDateHour')?.setValue(startDateHour);

        this.veichleControl.setValue({
          veichle: formValue.veichleName,
          id: formValue.veichle,
        });

        console.log('settato', this.veichleControl.value);
      }
    }
  }

  onSave() {
    const formValue = this.roadForm.value;
    const startDateHour = new Date(formValue.startDateHour).getHours();
    const startDateMinute = new Date(formValue.startDateHour).getMinutes();
    const startDate = new Date(formValue.startDate);
    startDate.setHours(startDateHour, startDateMinute);

    this.roadForm.removeControl('startDateHour');
    this.roadForm.patchValue({
      startDate,
    });

    this.ref.close(this.roadForm);
  }
}

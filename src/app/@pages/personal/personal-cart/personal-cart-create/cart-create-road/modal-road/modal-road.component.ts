import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-road',
  templateUrl: './modal-road.component.html',
  styleUrls: ['./modal-road.component.scss'],
})
export class ModalRoadComponent {
  roadForm: FormGroup = new FormGroup({
    from: new FormControl(null),
    to: new FormControl(null),
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    veichles: new FormArray([]),
  });
  isEdit: boolean = false;
  index: number = 0;
  veichlesList: any = [];

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
      this.roadForm = roadForm;
      this.veichlesList = veichlesList;
      this.index = index;
      this.isEdit = isEdit;
    }
  }

  onSave() {
    this.ref.close(this.roadForm);
  }
  onAddVeichle() {
    const newVeichle = new FormGroup({
      veichle: new FormControl(null),
      quantity: new FormControl(null),
    });
    this.veichles.push(newVeichle);
  }

  onRemoveVeichle(indexVeichle: number) {
    this.veichles.removeAt(indexVeichle);
  }
}

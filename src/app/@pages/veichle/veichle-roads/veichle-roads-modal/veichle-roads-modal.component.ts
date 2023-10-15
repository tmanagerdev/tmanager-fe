import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-veichle-roads-modal',
  templateUrl: './veichle-roads-modal.component.html',
  styleUrls: ['./veichle-roads-modal.component.scss'],
})
export class VeichleRoadsModalComponent {
  road: any;
  isEdit: boolean = false;

  roadForm: FormGroup = new FormGroup({
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    price: new FormControl(null),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.road = this.config.data.road;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.roadForm.patchValue(this.road);
      }
    }
  }

  onSave() {
    if (this.roadForm.valid) {
      const road = { ...this.roadForm.value };
      this.ref.close(road);
    }
  }
}

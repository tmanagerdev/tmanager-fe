import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-veichle-modal',
  templateUrl: './veichle-modal.component.html',
  styleUrls: ['./veichle-modal.component.scss'],
})
export class VeichleModalComponent {
  veichle: any;
  isEdit: boolean = false;
  veichleForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    latitude: new FormControl(null),
    longitude: new FormControl(null),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.veichle = this.config.data.veichle;
      this.isEdit = true;
      this.veichleForm.patchValue(this.veichle);
    }
  }

  onSave() {
    if (this.veichleForm.valid) {
      const veichle = this.veichleForm.value;
      this.ref.close(veichle);
    }
  }
}

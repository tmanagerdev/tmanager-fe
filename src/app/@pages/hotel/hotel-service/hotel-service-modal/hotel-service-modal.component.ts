import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-hotel-service-modal',
  templateUrl: './hotel-service-modal.component.html',
  styleUrls: ['./hotel-service-modal.component.scss'],
})
export class HotelServiceModalComponent {
  service: any;
  isEdit: boolean = false;

  serviceForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.service = this.config.data.service;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.serviceForm.patchValue(this.service);
      }
    }
  }

  onSave() {
    if (this.serviceForm.valid) {
      const service = { ...this.serviceForm.value };
      this.ref.close(service);
    }
  }
}

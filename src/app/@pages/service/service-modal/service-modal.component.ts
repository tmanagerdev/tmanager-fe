import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss'],
})
export class ServiceModalComponent {
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
      this.isEdit = true;
      this.serviceForm.patchValue(this.service);
    }
  }

  onSave() {
    if (this.serviceForm.valid) {
      const service = this.serviceForm.value;
      this.ref.close(service);
    }
  }
}

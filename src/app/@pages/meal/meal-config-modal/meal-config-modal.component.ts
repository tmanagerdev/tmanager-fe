import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IMealConfig } from 'src/app/@core/models/meal.model';

@Component({
  selector: 'app-meal-config-modal',
  templateUrl: './meal-config-modal.component.html',
  styleUrls: ['./meal-config-modal.component.scss'],
})
export class MealConfigModalComponent {
  config: Partial<IMealConfig> = {};
  isEdit: boolean = false;

  configForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    requireDescription: new FormControl(false),
  });

  constructor(
    public ref: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig
  ) {
    if (this.dialogConfig.data) {
      this.config = this.dialogConfig.data.config;
      this.isEdit = this.dialogConfig.data.isEdit;
      if (this.isEdit) {
        this.configForm.patchValue(this.config);
      }
    }
  }

  onSave() {
    if (this.configForm.valid) {
      const config = this.configForm.value;
      this.ref.close(config);
    }
  }
}

import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-city-modal',
  templateUrl: './city-modal.component.html',
  styleUrls: ['./city-modal.component.scss'],
})
export class CityModalComponent {
  city: any;
  isEdit: boolean = false;
  cityForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    latitude: new FormControl(null),
    longitude: new FormControl(null),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.city = this.config.data.city;
      this.isEdit = true;
      this.cityForm.patchValue(this.city);
    }
  }

  onSave() {
    if (this.cityForm.valid) {
      const city = this.cityForm.value;
      city.latitude = parseFloat(city.latitude);
      city.longitude = parseFloat(city.longitude);
      this.ref.close(city);
    }
  }
}

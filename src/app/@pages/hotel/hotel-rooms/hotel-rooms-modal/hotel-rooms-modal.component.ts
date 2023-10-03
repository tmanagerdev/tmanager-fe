import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-hotel-rooms-modal',
  templateUrl: './hotel-rooms-modal.component.html',
  styleUrls: ['./hotel-rooms-modal.component.scss'],
})
export class HotelRoomsModalComponent {
  room: any;
  isEdit: boolean = false;

  roomForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(null),
    numPax: new FormControl(null),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.room = this.config.data.room;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.roomForm.patchValue(this.room);
      }
    }
  }

  onSave() {
    if (this.roomForm.valid) {
      const room = { ...this.roomForm.value };
      this.ref.close(room);
    }
  }
}

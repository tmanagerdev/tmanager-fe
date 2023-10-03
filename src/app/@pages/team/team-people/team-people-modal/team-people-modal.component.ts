import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-team-people-modal',
  templateUrl: './team-people-modal.component.html',
  styleUrls: ['./team-people-modal.component.scss'],
})
export class TeamPeopleModalComponent {
  people: any;
  isEdit: boolean = false;
  categories = [
    { value: 'MANAGER', label: 'Dirigente' },
    { value: 'PLAYER', label: 'Giocatore' },
    { value: 'STAFF', label: 'Staff' },
  ];

  peopleForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    category: new FormControl('PLAYER', Validators.required),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.people = this.config.data.people;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.peopleForm.patchValue(this.people);
      }
    }
  }

  onSave() {
    if (this.peopleForm.valid) {
      const people = { ...this.peopleForm.value };
      this.ref.close(people);
    }
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ECategoryPeople,
  categoriesPeople,
} from 'src/app/@core/models/people.model';

@Component({
  selector: 'app-team-people-modal',
  templateUrl: './team-people-modal.component.html',
  styleUrls: ['./team-people-modal.component.scss'],
})
export class TeamPeopleModalComponent {
  people: any;
  isEdit: boolean = false;
  categories = categoriesPeople;

  peopleForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    category: new FormControl(ECategoryPeople.PLAYER, Validators.required),
    birthDate: new FormControl('', Validators.required),
    birthPlace: new FormControl('', Validators.required),
    docNumber: new FormControl('', Validators.required),
    docExpiredAt: new FormControl('', Validators.required),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.people = this.config.data.people;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.peopleForm.patchValue({
          ...this.people,
          birthDate: new Date(this.people.birthDate),
          docExpiredAt: new Date(this.people.docExpiredAt),
        });
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

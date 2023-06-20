import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-league-modal',
  templateUrl: './league-modal.component.html',
  styleUrls: ['./league-modal.component.scss'],
})
export class LeagueModalComponent {
  league: any;
  isEdit: boolean = false;
  leagueForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.league = this.config.data.league;
      this.isEdit = true;
      this.leagueForm.patchValue(this.league);
    }
  }

  onSave() {
    if (this.leagueForm.valid) {
      const league = this.leagueForm.value;
      this.ref.close(league);
    }
  }
}

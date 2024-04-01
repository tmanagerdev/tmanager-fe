import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-budget-modal',
  templateUrl: './budget-modal.component.html',
  styleUrls: ['./budget-modal.component.scss'],
})
export class BudgetModalComponent {
  budget: any;
  isEdit: boolean = false;

  budgetForm: FormGroup = new FormGroup({
    budget: new FormControl('', Validators.required),
  });

  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      this.budget = this.config.data.budget;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        console.log('patch budget', this.budget);
        this.budgetForm.patchValue({ budget: this.budget });
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.budgetForm.valid) {
      const activity = this.budgetForm.value;
      this.ref.close(activity);
    }
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';

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
  });

  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cityApiService: CityApiService
  ) {
    if (this.config.data) {
      this.veichle = this.config.data.veichle;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.veichleForm.patchValue(this.veichle);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.veichleForm.valid) {
      const veichle = this.veichleForm.value;
      this.ref.close(veichle);
    }
  }
}

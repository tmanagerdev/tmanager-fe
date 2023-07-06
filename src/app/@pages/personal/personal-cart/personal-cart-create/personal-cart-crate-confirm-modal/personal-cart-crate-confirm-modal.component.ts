import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-personal-cart-crate-confirm-modal',
  templateUrl: './personal-cart-crate-confirm-modal.component.html',
  styleUrls: ['./personal-cart-crate-confirm-modal.component.scss'],
})
export class PersonalCartCrateConfirmModalComponent {
  constructor(public ref: DynamicDialogRef) {}

  onClose(action: string): void {
    this.ref.close(action);
  }
}

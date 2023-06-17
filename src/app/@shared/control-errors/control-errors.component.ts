import { Component, Host, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlContainer } from '@angular/forms';

const defaultErrorMessages: { [key: string]: string } = {
  required: 'Questo campo è obbligatorio',
  invalidEmail: 'Email non valida',
  passwordMismatch: 'Le due password non coincidono',
};

@Component({
  selector: 'app-control-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-errors.component.html',
  styleUrls: ['./control-errors.component.scss'],
})
export class ControlErrorsComponent {
  /**
   * The name of the FormControl for which the errors should be displayed
   */
  @Input() controlName!: string;
  /**
   * Map of custom messages (same structure of defaultErrorMessages)
   */
  @Input() customMessages: { [key: string]: string } = {};

  control!: AbstractControl;
  errorMessage?: string = undefined;
  constructor(
    @Host()
    @Optional()
    private container: ControlContainer
  ) {}

  ngOnInit(): void {
    if (!this.container) {
      throw new Error(
        'Cannot find parent form group for controlName: ' + this.controlName
      );
    }

    const control = (this.container.control as AbstractControl).get(
      this.controlName
    );

    if (!control) {
      throw new Error(
        'Cannot find control with name ${this.controlName} in the parent formGroup/formArray'
      );
    }

    this.control = control;
    control.statusChanges.subscribe((status) => {
      this.setErrorMessage();
    });

    this.setErrorMessage();
  }

  setErrorMessage() {
    if (this.control.errors == null) {
      this.errorMessage = undefined;
      return;
    }

    Object.keys(this.control.errors).forEach((key) => {
      this.errorMessage = this.getValidatorMessage(
        key,
        this.control.errors![key]
      );
    });
  }

  getValidatorMessage(validatorName: string, validatorValue?: any) {
    return this.getValidatorMessageKey(validatorName);
  }

  private getValidatorMessageKey(validatorName: string): string {
    if (this.customMessages.hasOwnProperty(validatorName)) {
      return this.customMessages[validatorName];
    }

    if (defaultErrorMessages.hasOwnProperty(validatorName)) {
      return defaultErrorMessages[validatorName];
    }

    return 'Questo campo presenta un errore';
  }
}

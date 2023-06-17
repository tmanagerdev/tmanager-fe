import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;
    const isValid = emailRegex.test(email);

    return isValid ? null : { invalidEmail: true };
  };
}

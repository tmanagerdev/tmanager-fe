import { FormArray, FormGroup } from '@angular/forms';

export const markFormAsTouched = (form: FormGroup) => {
  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field)!;
    control.markAsTouched({ onlySelf: true });
  });
};

export const clearFormArray = (formArray: FormArray) => {
  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }
};

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

export const convertToBase64 = (file: File | Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

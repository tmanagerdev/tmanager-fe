import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe extends DatePipe implements PipeTransform {
  override transform(value: any, args?: any): any {
    return args
      ? args === 'showHours'
        ? super.transform(value, 'dd/MM/yyyy HH:mm')
        : super.transform(value, 'dd/MM/yyyy')
      : super.transform(value, 'dd/MM/yyyy');
  }
}

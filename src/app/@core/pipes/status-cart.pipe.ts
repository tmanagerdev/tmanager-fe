import { Pipe, PipeTransform } from '@angular/core';
import { EStatusCart, statusCart } from '../models/cart.model';

@Pipe({
  name: 'statusCart',
  standalone: true,
})
export class StatusCartPipe implements PipeTransform {
  transform(value: EStatusCart, args?: any): any {
    const status = statusCart.find((c) => c.value === value)?.label ?? '';
    return status;
  }
}

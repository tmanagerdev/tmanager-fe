import { Pipe, PipeTransform } from '@angular/core';
import { rolesUser } from '../models/user.model';

@Pipe({
  name: 'userRole',
  standalone: true,
})
export class UserRolePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const role = rolesUser.find((r) => r.value === value)?.label ?? '';
    return role;
  }
}

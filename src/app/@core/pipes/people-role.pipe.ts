import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'peopleRole',
  standalone: true,
})
export class PeopleRolePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value === 'MANAGER'
      ? 'Dirigente'
      : value === 'PLAYER'
      ? 'Giocatore'
      : 'Staff';
  }
}

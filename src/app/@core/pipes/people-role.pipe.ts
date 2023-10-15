import { Pipe, PipeTransform } from '@angular/core';
import { ECategoryPeople, categoriesPeople } from '../models/people.model';

@Pipe({
  name: 'peopleRole',
  standalone: true,
})
export class PeopleRolePipe implements PipeTransform {
  transform(value: ECategoryPeople, args?: any): any {
    const category =
      categoriesPeople.find((c) => c.value === value)?.label ?? '';
    return category;
  }
}

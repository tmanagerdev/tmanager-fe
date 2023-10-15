import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartCreateAccomodationsService {
  originalPeople: any;
  people$: BehaviorSubject<any> = new BehaviorSubject([]);

  get people() {
    return this.people$.value;
  }

  constructor() {}

  initPeople(people: any, room: any) {
    this.originalPeople = [...people];
    this.people$.next(
      people
        .filter((p: any) => room.every((r: number) => r !== p.id))
        .sort(this.compare)
    );
  }

  updatePeple(peopleId: number, action: 'ADD' | 'REMOVE') {
    if (action === 'ADD') {
      this.people$.next(
        [...this.people.filter((p: any) => p.id !== peopleId)].sort(
          this.compare
        )
      );
    } else if (action === 'REMOVE') {
      const p = this.originalPeople.find((p: any) => p.id === peopleId);
      this.people$.next([...this.people, p].sort(this.compare));
    }
  }

  compare(a: any, b: any) {
    return a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : 0;
  }
}

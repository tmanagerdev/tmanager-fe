import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPeople } from 'src/app/@core/models/people.model';

@Injectable({
  providedIn: 'root',
})
export class PeopleRoomingService {
  originalPeople: any;
  private peopleBSub$: BehaviorSubject<any> = new BehaviorSubject([]);
  peopleOb$ = this.peopleBSub$.asObservable();

  get people() {
    return this.peopleBSub$.value;
  }

  constructor() {}

  initPeople(people: any, room: any) {
    this.originalPeople = [...people];
    this.peopleBSub$.next(
      people
        .filter((p: any) =>
          room.every((r: any) => !this.checkPaxAreEquals(r, p))
        )
        .sort(this.compare)
    );
  }

  // Fired when add or remove a pax to cart
  updatePeople(people: any, action: 'ADD' | 'REMOVE') {
    if (action === 'ADD') {
      this.peopleBSub$.next([...this.people, people].sort(this.compare));
    } else if (action === 'REMOVE') {
      const newPeopleArray = this.people.filter((p: IPeople) => {
        return !this.checkPaxAreEquals(p, people);
      });
      this.peopleBSub$.next([...newPeopleArray].sort(this.compare));
    }
  }

  // Fired when change a rooming
  updateRooming(people: IPeople, action: 'ADD' | 'REMOVE') {
    if (action === 'ADD') {
      this.peopleBSub$.next(
        [
          ...this.people.filter((p: any) => !this.checkPaxAreEquals(p, people)),
        ].sort(this.compare)
      );
    } else if (action === 'REMOVE') {
      const p = this.originalPeople.find((p: any) =>
        this.checkPaxAreEquals(p, people)
      );
      this.peopleBSub$.next([...this.people, p].sort(this.compare));
    }
  }

  compare(a: any, b: any) {
    return a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : 0;
  }

  checkPaxAreEquals(pax1: IPeople, pax2: IPeople) {
    return (
      `${pax1.name.toLocaleLowerCase().trim()}${pax1.surname
        .toLocaleLowerCase()
        .trim()}${pax1.category.toLocaleLowerCase().trim()}` ===
      `${pax2.name.toLocaleLowerCase().trim()}${pax2.surname
        .toLocaleLowerCase()
        .trim()}${pax2.category.toLocaleLowerCase().trim()}`
    );
  }
}

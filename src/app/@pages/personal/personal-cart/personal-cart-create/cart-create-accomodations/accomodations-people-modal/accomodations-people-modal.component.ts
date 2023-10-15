import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartCreateAccomodationsService } from '../cart-create-accomodations.service';
import { Subject, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-accomodations-people-modal',
  templateUrl: './accomodations-people-modal.component.html',
  styleUrls: ['./accomodations-people-modal.component.scss'],
})
export class AccomodationsPeopleModalComponent {
  people: any[] = [];
  peopleViewed: any[] = [];
  selectedPeople: any[] = [];
  draggedProduct: any | undefined | null;
  blockedPanel: boolean = false;

  destroy$: Subject<void> = new Subject();

  get roomBlocked() {
    return this.config.data
      ? this.selectedPeople.length >= this.config.data.numPax
      : false;
  }

  get numPax() {
    return this.config.data.numPax;
  }

  get selectedPeopleLength() {
    return this.selectedPeople.length;
  }

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private accomodationService: CartCreateAccomodationsService
  ) {
    if (this.config.data) {
      for (const r of this.config.data.rooming) {
        this.selectedPeople.push({
          id: r.people.id ?? null,
          name: r.people.name ?? r.name,
          surname: r.people.surname ?? r.surname,
          category: r.people.category ?? r.category,
        });
      }
    }

    this.accomodationService.people$
      .pipe(
        takeUntil(this.destroy$),
        //map((people) => people.filter((p: any) => p.available)),
        tap((people) => {
          console.log('inside map');
          this.people = [...people];
          this.peopleViewed = [...people];

          console.log(this.people);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddGuest(people: any) {
    this.selectedPeople = [...this.selectedPeople, people];
    //this.peopleViewed = this.peopleViewed?.filter((p) => p.id !== people.id);

    if (people && people.id) {
      this.accomodationService.updatePeple(people.id, 'ADD');
    }
  }

  onRemoveGuest(people: any) {
    //const originalIndex = this.people.findIndex((p) => p.id === people.id);
    //this.peopleViewed.splice(originalIndex, 0, people);
    this.selectedPeople = this.selectedPeople?.filter(
      (p) => p.id !== people.id
    );

    if (people && people.id) {
      console.log('call update people');
      this.accomodationService.updatePeple(people.id, 'REMOVE');
    }
  }

  onSave() {
    this.ref.close(this.selectedPeople);
  }

  onAddPlaceholder(category: string) {
    this.selectedPeople = [
      ...this.selectedPeople,
      { name: 'OSPITE DA CONFERMARE', surname: '', category },
    ];
  }
}

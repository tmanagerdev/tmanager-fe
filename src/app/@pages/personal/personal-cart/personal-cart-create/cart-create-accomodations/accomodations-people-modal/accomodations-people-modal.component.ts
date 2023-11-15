import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PeopleRoomingService } from '../../people-rooming.service';
import { Subject, takeUntil, tap } from 'rxjs';

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
    private peopleRoomingService: PeopleRoomingService
  ) {
    if (this.config.data) {
      for (const r of this.config.data.rooming) {
        this.selectedPeople.push({
          name: r.name,
          surname: r.surname,
          category: r.category,
        });
      }
    }

    this.peopleRoomingService.peopleOb$
      .pipe(
        takeUntil(this.destroy$),
        tap((people) => {
          this.people = [...people];
          this.peopleViewed = [...people];
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

    if (people) {
      this.peopleRoomingService.updateRooming(people, 'ADD');
    }
  }

  onRemoveGuest(people: any) {
    this.selectedPeople = this.selectedPeople?.filter(
      (p) => !this.peopleRoomingService.checkPaxAreEquals(p, people)
    );

    if (people) {
      this.peopleRoomingService.updateRooming(people, 'REMOVE');
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

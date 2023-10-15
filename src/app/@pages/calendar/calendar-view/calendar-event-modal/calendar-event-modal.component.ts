import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { IEvent } from 'src/app/@core/models/event.model';
import { ITeam } from 'src/app/@core/models/team.model';

@Component({
  selector: 'app-calendar-event-modal',
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.scss'],
})
export class CalendarEventModalComponent {
  event!: Partial<IEvent>;
  isEdit: boolean = false;
  teams: Partial<ITeam>[] = [];

  eventForm: FormGroup = new FormGroup({
    date: new FormControl(null, Validators.required),
    hour: new FormControl(null, Validators.required),
    home: new FormControl(null, Validators.required),
    away: new FormControl(null, Validators.required),
  });

  teams$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private teamApiService: TeamApiService
  ) {
    if (this.config.data) {
      this.event = this.config.data.event;
      this.isEdit = this.config.data.isEditing;
      this.eventForm.patchValue({
        ...this.event,
        date: new Date(this.event.date!),
        hour: new Date(this.event.date!),
      });
      this.teams.push({ ...this.event.home });
      this.teams.push({ ...this.event.away });
    }

    this.teams$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.teamApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.teams = [...data];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.eventForm.valid) {
      const event = this.eventForm.value;
      const hours = new Date(event.hour).getHours();
      const minutes = new Date(event.hour).getMinutes();
      const eventDate = new Date(event.date);
      eventDate.setHours(hours, minutes);
      this.ref.close({
        ...event,
        away: event.away.id,
        home: event.home.id,
        day: this.event.day,
        calendar: this.config.data.calendarId,
        date: eventDate,
      });
    }
  }

  loadFilteredTeams(name: string) {
    this.teams$.next(name);
  }

  onFilterTeam({ filter }: IDropdownFilters) {
    if (filter && filter.length > 2) {
      this.loadFilteredTeams(filter);
    }
  }
}

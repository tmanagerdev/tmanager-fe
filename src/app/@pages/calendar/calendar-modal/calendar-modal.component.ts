import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { LeagueApiService } from 'src/app/@core/api/league-api.service';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
})
export class CalendarModalComponent {
  calendar: any;
  isEdit: boolean = false;
  leagues: any[] = [];

  calendarForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    league: new FormControl('', Validators.required),
    startDate: new FormControl(null, Validators.required),
    endDate: new FormControl(null, Validators.required),
    dates: new FormControl(null, Validators.required),
  });

  leagues$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private leagueApiService: LeagueApiService
  ) {
    if (this.config.data) {
      this.calendar = this.config.data.calendar;
      this.isEdit = true;
      this.calendarForm.patchValue({
        ...this.calendar,
        startDate: new Date(this.calendar.startDate),
        endDate: new Date(this.calendar.endDate),
      });
    }

    this.leagues$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.leagueApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.leagues = [...data];
        })
      )
      .subscribe();
  }

  onSave() {
    if (this.calendarForm.valid) {
      const calendar = this.calendarForm.value;
      this.ref.close({
        ...calendar,
        league: calendar.league.id,
      });
    }
  }

  loadFilteredLeagues(name: string) {
    this.leagues$.next(name);
  }

  onFilterLeague({ filter }: any) {
    if (filter && filter.length > 3) {
      this.loadFilteredLeagues(filter);
    }
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { ITeam } from 'src/app/@core/models/team.model';

@Component({
  selector: 'app-hotel-teams-modal',
  templateUrl: './hotel-teams-modal.component.html',
  styleUrls: ['./hotel-teams-modal.component.scss'],
})
export class HotelTeamsModalComponent {
  team: any;
  teams: Partial<ITeam>[] = [];

  teams$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  teamControl: FormControl = new FormControl('', Validators.required);

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private teamApiService: TeamApiService
  ) {
    if (this.config.data) {
      this.team = this.config.data.team;
      this.teamControl.patchValue(this.team);
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
    if (this.teamControl.valid) {
      const team = { ...this.teamControl.value };
      this.ref.close(team);
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

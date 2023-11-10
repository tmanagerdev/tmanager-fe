import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { ITeam } from 'src/app/@core/models/team.model';

@Component({
  selector: 'app-activity-teams-modal',
  templateUrl: './activity-teams-modal.component.html',
  styleUrls: ['./activity-teams-modal.component.scss'],
})
export class ActivityTeamsModalComponent {
  team: any;
  teams: Partial<ITeam>[] = [];

  teams$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  teamForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
  });

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private teamApiService: TeamApiService
  ) {
    if (this.config.data) {
      this.team = this.config.data.team;
      this.teamForm.patchValue(this.team);
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
    if (this.teamForm.valid) {
      const team = { ...this.teamForm.value };
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

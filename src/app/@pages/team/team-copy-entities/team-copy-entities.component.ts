import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, tap } from 'rxjs';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { ITeam } from 'src/app/@core/models/team.model';

@Component({
  selector: 'app-team-copy-entities',
  templateUrl: './team-copy-entities.component.html',
  styleUrls: ['./team-copy-entities.component.scss'],
})
export class TeamCopyEntitiesComponent {
  copyEntitiesForm: FormGroup = new FormGroup({
    team: new FormControl(null, Validators.required),
    hotel: new FormControl(false),
    activity: new FormControl(false),
    road: new FormControl(false),
  });

  teams$: Subject<string> = new Subject();

  destroyRef = inject(DestroyRef);
  teams: Partial<ITeam>[] = [];

  constructor(
    public ref: DynamicDialogRef,
    private teamApiService: TeamApiService
  ) {
    this.teams$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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

  onSave() {
    if (this.copyEntitiesForm.valid) {
      const copyLinkValue = this.copyEntitiesForm.value;
      this.ref.close(copyLinkValue);
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

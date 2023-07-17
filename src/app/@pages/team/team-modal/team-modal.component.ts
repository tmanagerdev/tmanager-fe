import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { LeagueApiService } from 'src/app/@core/api/league-api.service';

@Component({
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.scss'],
})
export class TeamModalComponent {
  team: any;
  isEdit: boolean = false;
  cities: any[] = [];
  leagues: any[] = [];

  teamForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    league: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    logoUrl: new FormControl(null),
  });

  leagues$: Subject<string> = new Subject();
  cities$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cityApiService: CityApiService,
    private leagueApiService: LeagueApiService
  ) {
    if (this.config.data) {
      this.team = this.config.data.team;
      this.isEdit = true;
      this.teamForm.patchValue(this.team);
      this.leagues.push({ ...this.team.league });
      this.cities.push({ ...this.team.city });
    }

    this.cities$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.cityApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.cities = [...data];
        })
      )
      .subscribe();

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
    if (this.teamForm.valid) {
      const team = { ...this.teamForm.value };
      console.log('team', team);
      // this.ref.close({
      //   name: team.name,
      //   city: team.city.id,
      //   league: team.league.id,
      //   logo: team.logoUrl,
      // });
    }
  }

  loadFilteredCities(name: string) {
    this.cities$.next(name);
  }

  loadFilteredLeagues(name: string) {
    this.leagues$.next(name);
  }

  onFilterCity({ query }: any) {
    this.loadFilteredCities(query);
  }

  onFilterLeague({ query }: any) {
    this.loadFilteredLeagues(query);
  }
}

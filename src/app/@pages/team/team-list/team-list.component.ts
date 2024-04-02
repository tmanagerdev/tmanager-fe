import { Component, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { LeagueApiService } from 'src/app/@core/api/league-api.service';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { ISort } from 'src/app/@core/models/base.model';
import { TeamCopyEntitiesComponent } from '../team-copy-entities/team-copy-entities.component';
import { TeamModalComponent } from '../team-modal/team-modal.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent {
  teams: any[] = [];
  cities: any[] = [];
  leagues: any[] = [];

  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: ISort | null = null;
  loading: boolean = false;

  searchFilter = new FormControl('');
  cityFilter = new UntypedFormControl(null);
  leagueFilter = new UntypedFormControl(null);
  filterActive: boolean = false;

  teams$: Subject<void> = new Subject();
  leagues$: Subject<string> = new Subject();
  cities$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  @ViewChild('filters') filtersPopup!: OverlayPanel;

  get cityFilterId() {
    return this.cityFilter.value ? this.cityFilter.value.id : null;
  }

  get leagueFilterId() {
    return this.leagueFilter.value ? this.leagueFilter.value.id : null;
  }

  get filterIcon(): string {
    return this.filterActive ? 'pi pi-filter-fill' : 'pi pi-filter';
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private teamApiService: TeamApiService,
    private cityApiService: CityApiService,
    private leagueApiService: LeagueApiService,
    public dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.teams$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.teamApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.cityFilterId ? { city: this.cityFilterId } : {}),
            ...(this.leagueFilterId ? { league: this.leagueFilterId } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.teams = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

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

    this.searchFilter.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter = val || '';
          this.loadTeams();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeams() {
    this.loading = true;
    this.teams = [];
    this.teams$.next();
  }

  loadFilteredCities(name: string) {
    this.cities$.next(name);
  }

  loadFilteredLeagues(name: string) {
    this.leagues$.next(name);
  }

  onChangePage(event: TableLazyLoadEvent) {
    this.page = event.first! / event.rows! || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder ?? 0,
      };
    } else {
      this.sort = null;
    }

    this.loadTeams();
  }

  create() {
    this.ref = this.dialogService.open(TeamModalComponent, {
      header: 'Crea nuova squadra',
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((team: any) => {
      if (team) {
        this.teamApiService
          .create(team)
          .pipe(
            take(1),
            tap(() => {
              this.loadTeams();
              this.messageService.add({
                severity: 'success',
                summary: 'Squadra creata',
                detail: team.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  applyFilters() {
    this.filterActive = true;
    this.filtersPopup.hide();
    this.loadTeams();
  }

  resetFilters() {
    this.filterActive = false;
    this.cityFilter.setValue(null);
    this.leagueFilter.setValue(null);
    this.filtersPopup.hide();
    this.loadTeams();
  }

  update(team: any) {
    this.ref = this.dialogService.open(TeamModalComponent, {
      header: `Aggiorna ${team.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        team,
      },
    });

    this.ref.onClose.subscribe((newTeam: any) => {
      if (newTeam) {
        this.teams = [];
        this.loading = true;
        this.teamApiService
          .update(team.id, newTeam)
          .pipe(
            take(1),
            tap(() => {
              this.loadTeams();
              this.messageService.add({
                severity: 'success',
                summary: 'Squadra aggiornata',
                detail: newTeam.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(city: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa squadra?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.teamApiService
          .delete(city.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadTeams();
              this.messageService.add({
                severity: 'success',
                summary: 'Squadra eliminata',
                detail: city.name,
              });
            })
          )
          .subscribe();
      },
    });
  }

  onFilterCity({ filter }: any) {
    if (filter) {
      this.loadFilteredCities(filter);
    }
  }

  onFilterLeague({ filter }: any) {
    if (filter) {
      this.loadFilteredLeagues(filter);
    }
  }

  people(team: any) {
    this.router.navigate(['team', team.id]);
  }

  copyEntities(team: any) {
    this.ref = this.dialogService.open(TeamCopyEntitiesComponent, {
      header: `Associazioni ${team.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        team,
      },
    });

    this.ref.onClose.subscribe((copyConfig: any) => {
      if (copyConfig) {
        this.teams = [];
        this.loading = true;
        this.teamApiService
          .copyEntities({
            from: copyConfig.team.id,
            to: team.id,
            hotel: copyConfig.hotel,
            activity: copyConfig.activity,
            road: copyConfig.road,
          })
          .pipe(
            take(1),
            tap(() => {
              this.loadTeams();
              this.messageService.add({
                severity: 'success',
                summary: 'Squadra aggiornata',
                detail: `Ora ${team.name} ha le associazioni di ${copyConfig.team.name}`,
              });
            })
          )
          .subscribe();
      }
    });
  }
}

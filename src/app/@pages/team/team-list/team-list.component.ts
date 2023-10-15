import { Component, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { LeagueApiService } from 'src/app/@core/api/league-api.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { Router } from '@angular/router';

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
  sort: any = null;
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

  onChangePage(event: LazyLoadEvent) {
    this.page = event.first! / event.rows! || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder,
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
    if (filter && filter.length > 3) {
      this.loadFilteredCities(filter);
    }
  }

  onFilterLeague({ filter }: any) {
    if (filter && filter.length > 3) {
      this.loadFilteredLeagues(filter);
    }
  }

  people(team: any) {
    this.router.navigate(['team', team.id]);
  }
}

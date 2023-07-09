import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
} from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil, switchMap, tap, debounceTime, take } from 'rxjs';
import { LeagueApiService } from 'src/app/@core/api/league-api.service';
import { LeagueModalComponent } from '../league-modal/league-modal.component';

@Component({
  selector: 'app-league-list',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss'],
})
export class LeagueListComponent {
  leagues: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 50;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;

  searchFilter = new FormControl('');

  leagues$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private leagueApiService: LeagueApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.leagues$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.leagueApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.leagues = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

    this.searchFilter.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter = val || '';
          this.loadLeagues();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLeagues() {
    this.loading = true;
    this.leagues = [];
    this.leagues$.next();
  }

  onChangePage(event: LazyLoadEvent) {
    this.page = event.first || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder,
      };
    } else {
      this.sort = null;
    }

    this.loadLeagues();
  }

  create() {
    this.ref = this.dialogService.open(LeagueModalComponent, {
      header: 'Crea nuovo campionato',
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((league: any) => {
      if (league) {
        this.leagueApiService
          .create(league)
          .pipe(
            take(1),
            tap(() => {
              this.loadLeagues();
              this.messageService.add({
                severity: 'success',
                summary: 'Campionato creato',
                detail: league.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(league: any) {
    this.ref = this.dialogService.open(LeagueModalComponent, {
      header: `Aggiorna ${league.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        league,
      },
    });

    this.ref.onClose.subscribe((newLeague: any) => {
      if (newLeague) {
        this.leagueApiService
          .update(league.id, newLeague)
          .pipe(
            take(1),
            tap(() => {
              this.loadLeagues();
              this.messageService.add({
                severity: 'success',
                summary: 'Campionato aggiornato',
                detail: newLeague.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(league: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo campionato?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.leagueApiService
          .delete(league.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadLeagues();
              this.messageService.add({
                severity: 'success',
                summary: 'Città eliminata',
                detail: league.name,
              });
            })
          )
          .subscribe();
      },
    });
  }
}

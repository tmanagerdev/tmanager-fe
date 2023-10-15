import { Component } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarApiService } from 'src/app/@core/api/calendar-api.service';
import { CalendarModalComponent } from '../calendar-modal/calendar-modal.component';
import { Subject, debounceTime, switchMap, take, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ICalendar } from 'src/app/@core/models/calendar.model';
import { ISort } from 'src/app/@core/models/base.model';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarListComponent {
  calendars: Partial<ICalendar>[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: ISort | null = null;
  loading: boolean = false;

  searchFilter = new FormControl('');

  calendars$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(5);
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private calendarApiService: CalendarApiService,
    public dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.calendars$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.calendarApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.calendars = [...data];
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
          this.loadCalendars();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCalendars() {
    this.loading = true;
    this.calendars = [];
    this.calendars$.next();
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

    this.loadCalendars();
  }

  create() {
    this.ref = this.dialogService.open(CalendarModalComponent, {
      header: `Crea nuovo calendario`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((newCalendar: Partial<ICalendar>) => {
      if (newCalendar) {
        this.calendarApiService
          .create(newCalendar)
          .pipe(
            take(1),
            tap(() => {
              this.loadCalendars();
              this.messageService.add({
                severity: 'success',
                summary: 'Calendario creato',
                detail: newCalendar.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(calendar: Partial<ICalendar>) {
    this.ref = this.dialogService.open(CalendarModalComponent, {
      header: `Aggiorna ${calendar.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        calendar,
      },
    });

    this.ref.onClose.subscribe((newCalendar: Partial<ICalendar>) => {
      if (newCalendar) {
        this.calendarApiService
          .update(calendar.id!, newCalendar)
          .pipe(
            take(1),
            tap(() => {
              this.loadCalendars();
              this.messageService.add({
                severity: 'success',
                summary: 'Calendario aggiornato',
                detail: newCalendar.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(calendar: Partial<ICalendar>) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo calendario?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.calendarApiService
          .delete(calendar.id!)
          .pipe(
            take(1),
            tap(() => {
              this.loadCalendars();
              this.messageService.add({
                severity: 'success',
                summary: 'Calendario eliminato',
                detail: calendar.name,
              });
            })
          )
          .subscribe();
      },
    });
  }

  detail(calendar: Partial<ICalendar>) {
    this.router.navigate(['calendar', calendar.id]);
  }
}

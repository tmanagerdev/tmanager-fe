import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { CalendarApiService } from 'src/app/@core/api/calendar-api.service';
import { CalendarEventModalComponent } from './calendar-event-modal/calendar-event-modal.component';
import { EventApiService } from 'src/app/@core/api/events-api.service';
import { ICalendar } from 'src/app/@core/models/calendar.model';
import { IEvent } from 'src/app/@core/models/event.model';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  calendarId: number = 0;
  calendar!: Partial<ICalendar>;
  activeDay: number = 0;
  totalDays: number[] = [];
  activeGames: Partial<ICalendar>[] = [];
  viewOptions = [
    { label: 'Tutte', value: 'all' },
    { label: 'Andata', value: 'first' },
    { label: 'Ritorno', value: 'second' },
  ];
  ref!: DynamicDialogRef;

  viewControl: FormControl = new FormControl('all');

  calendar$: Subject<void> = new Subject();
  events$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private calendarApiService: CalendarApiService,
    private eventApiService: EventApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.calendarId = this.route.snapshot.params['id'];

    this.calendar$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.calendarApiService.findOne(this.calendarId)),
        tap((data) => (this.calendar = { ...data })),
        tap(() => {
          this.totalDays = Array(this.calendar.dates)
            .fill(0)
            .map((d, i) => i);
          this.loadGames();
        })
      )
      .subscribe();

    this.events$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          this.calendarApiService.findEvents(this.calendarId, {
            day: this.activeDay + 1,
          })
        ),
        tap((data) => (this.activeGames = [...data]))
      )
      .subscribe();

    this.viewControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((v) => {
          switch (v) {
            case 'all':
              this.totalDays = Array(this.calendar.dates)
                .fill(0)
                .map((d, i) => i);
              break;
            case 'first':
              this.totalDays = Array(this.calendar.dates! / 2)
                .fill(0)
                .map((d, i) => i);
              break;
            case 'second':
              this.totalDays = Array(this.calendar.dates! / 2)
                .fill(0)
                .map((d, i) => i + 18);
              this.activeDay = this.activeDay + 18;
              break;
            default:
              break;
          }

          this.loadGames();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadCalendar();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCalendar(): void {
    this.calendar$.next();
  }

  loadGames() {
    this.events$.next();
  }

  onNewTab(event: number): void {
    switch (this.viewControl.value) {
      case 'second':
        event = event + 18;
        break;
      default:
        break;
    }
    this.activeDay = event;
    this.events$.next();
  }

  create() {
    this.ref = this.dialogService.open(CalendarEventModalComponent, {
      header: `Crea nuova partita`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        event: {
          date: new Date(),
          day: this.activeDay + 1,
        },
        isEditing: false,
        calendarId: this.calendarId,
      },
    });

    this.ref.onClose.subscribe((newEvent: Partial<IEvent>) => {
      if (newEvent) {
        this.eventApiService
          .create(newEvent)
          .pipe(
            take(1),
            tap((data) => {
              this.loadCalendar();
              this.messageService.add({
                severity: 'success',
                summary: 'Partita aggiunta',
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(event: Partial<IEvent>) {
    this.ref = this.dialogService.open(CalendarEventModalComponent, {
      header: `Aggiorna partita`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        event,
        calendarId: this.calendarId,
      },
    });

    this.ref.onClose.subscribe((newEvent: Partial<IEvent>) => {
      if (newEvent) {
        this.eventApiService
          .update(event.id!, newEvent)
          .pipe(
            take(1),
            tap((data) => {
              this.loadCalendar();
              this.messageService.add({
                severity: 'success',
                summary: 'Partita aggiornata',
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(event: Partial<IEvent>) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa partita?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eventApiService
          .delete(event.id!)
          .pipe(
            take(1),
            tap(() => {
              this.loadCalendar();
              this.messageService.add({
                severity: 'success',
                summary: 'Partita eliminata',
              });
            })
          )
          .subscribe();
      },
    });
  }

  backToCalendar() {
    this.router.navigate(['/calendar']);
  }
}

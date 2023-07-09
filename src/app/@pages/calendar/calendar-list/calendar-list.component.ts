import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CalendarApiService } from 'src/app/@core/api/calendar-api.service';
import { EntityListComponent } from 'src/app/@shared/entity-list/entity-list.component';
import { CalendarModalComponent } from '../calendar-modal/calendar-modal.component';
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarListComponent extends EntityListComponent {
  ref!: DynamicDialogRef;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private calendarApiService: CalendarApiService,
    public dialogService: DialogService,
    private router: Router
  ) {
    super();

    super.apiFetch$ = this.calendarApiService.findAll({
      page: this.page + 1,
      take: this.size,
      ...(this.filter ? { name: this.filter } : {}),
      ...(this.sort && this.sort.field
        ? { sortField: this.sort.field, sortOrder: this.sort.order }
        : {}),
    });

    super.cellsNumber = 8;
  }

  create() {
    this.ref = this.dialogService.open(CalendarModalComponent, {
      header: `Crea nuovo calendario`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((newCalendar: any) => {
      if (newCalendar) {
        this.calendarApiService
          .create(newCalendar)
          .pipe(
            take(1),
            tap((data) => {
              this.loadData();
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

  update(calendar: any) {
    this.ref = this.dialogService.open(CalendarModalComponent, {
      header: `Aggiorna ${calendar.name}`,
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        calendar,
      },
    });

    this.ref.onClose.subscribe((newCalendar: any) => {
      if (newCalendar) {
        this.calendarApiService
          .update(calendar.id, newCalendar)
          .pipe(
            take(1),
            tap((data) => {
              this.loadData();
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

  remove(calendar: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo calendario?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.calendarApiService
          .delete(calendar.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadData();
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

  detail(calendar: any) {
    this.router.navigate(['calendar', calendar.id]);
  }
}

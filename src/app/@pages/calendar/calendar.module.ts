import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { EntityListComponent } from 'src/app/@shared/entity-list/entity-list.component';
import { CalendarModule as PrimeCalendar } from 'primeng/calendar';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TeamLogoComponent } from '../../@shared/team-logo/team-logo.component';
import { CalendarEventModalComponent } from './calendar-view/calendar-event-modal/calendar-event-modal.component';

@NgModule({
  declarations: [
    CalendarListComponent,
    CalendarModalComponent,
    CalendarViewComponent,
    CalendarEventModalComponent,
  ],
  providers: [MessageService, ConfirmationService, DialogService],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CustomDatePipe,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    KeyFilterModule,
    ConfirmDialogModule,
    SkeletonModule,
    DropdownModule,
    AutoCompleteModule,
    ChipModule,
    DividerModule,
    EntityListComponent,
    PrimeCalendar,
    InputNumberModule,
    TabViewModule,
    SelectButtonModule,
    TeamLogoComponent,
  ],
})
export class CalendarModule {}

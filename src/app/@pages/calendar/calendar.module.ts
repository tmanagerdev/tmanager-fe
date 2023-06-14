import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { CalendarRoutingModule } from './calendar-routing.module';



@NgModule({
  declarations: [
    CalendarListComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule
  ]
})
export class CalendarModule { }

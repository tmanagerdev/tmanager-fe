import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarListComponent,
  },
  {
    path: ':id',
    component: CalendarViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}

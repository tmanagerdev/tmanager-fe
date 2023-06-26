import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalEventListComponent } from './personal-event-list/personal-event-list.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalEventListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalEventRoutingModule {}

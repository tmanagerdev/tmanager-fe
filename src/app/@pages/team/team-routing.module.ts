import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamPeopleComponent } from './team-people/team-people.component';

const routes: Routes = [
  {
    path: '',
    component: TeamListComponent,
  },
  {
    path: ':id',
    component: TeamPeopleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}

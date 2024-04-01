import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityTeamsComponent } from './activity-teams/activity-teams.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityListComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: 'teams',
        component: ActivityTeamsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}

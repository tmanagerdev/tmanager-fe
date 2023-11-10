import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoadListComponent } from './road-list/road-list.component';
import { RoadTeamsComponent } from './road-teams/road-teams.component';

const routes: Routes = [
  {
    path: '',
    component: RoadListComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: 'teams',
        component: RoadTeamsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadRoutingModule {}

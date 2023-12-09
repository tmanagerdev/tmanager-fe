import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoadListComponent } from './road-list/road-list.component';
import { RoadTeamsComponent } from './road-teams/road-teams.component';
import { RoadVeichlesComponent } from './road-veichles/road-veichles.component';

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
      {
        path: 'veichles',
        component: RoadVeichlesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadRoutingModule {}

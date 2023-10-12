import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeichleListComponent } from './veichle-list/veichle-list.component';
import { VeichleRoadsComponent } from './veichle-roads/veichle-roads.component';

const routes: Routes = [
  {
    path: '',
    component: VeichleListComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: 'roads',
        component: VeichleRoadsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CityRoutingModule {}

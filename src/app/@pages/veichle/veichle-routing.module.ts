import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeichleListComponent } from './veichle-list/veichle-list.component';

const routes: Routes = [
  {
    path: '',
    component: VeichleListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CityRoutingModule {}

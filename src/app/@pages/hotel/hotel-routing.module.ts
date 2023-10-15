import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelRoomsComponent } from './hotel-rooms/hotel-rooms.component';
import { HotelMealsComponent } from './hotel-meals/hotel-meals.component';

const routes: Routes = [
  {
    path: '',
    component: HotelListComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        component: HotelRoomsComponent,
      },
      {
        path: 'meals',
        component: HotelMealsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelRoutingModule {}

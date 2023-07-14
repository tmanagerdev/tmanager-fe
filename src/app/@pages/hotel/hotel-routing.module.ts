import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelRoomsComponent } from './hotel-rooms/hotel-rooms.component';

const routes: Routes = [
  {
    path: '',
    component: HotelListComponent,
  },
  {
    path: ':id',
    component: HotelRoomsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelRoutingModule {}

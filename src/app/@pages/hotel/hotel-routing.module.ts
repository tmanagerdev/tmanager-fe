import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelRoomsComponent } from './hotel-rooms/hotel-rooms.component';
import { HotelTeamsComponent } from './hotel-teams/hotel-teams.component';
import { HotelServiceComponent } from './hotel-service/hotel-service.component';

const routes: Routes = [
  {
    path: '',
    component: HotelListComponent,
  },
  {
    path: ':id',
    children: [
      {
        path: 'rooms',
        component: HotelRoomsComponent,
      },
      {
        path: 'teams',
        component: HotelTeamsComponent,
      },
      {
        path: 'services',
        component: HotelServiceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelRoutingModule {}

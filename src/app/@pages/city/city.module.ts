import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityRoutingModule } from './city-routing.module';
import { CityListComponent } from './city-list/city-list.component';



@NgModule({
  declarations: [CityListComponent],
  imports: [
    CommonModule,
    CityRoutingModule,
  ]
})
export class CityModule { }

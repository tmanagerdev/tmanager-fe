import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalEventListComponent } from './personal-event-list/personal-event-list.component';
import { PersonalEventRoutingModule } from './personal-event-routing.module';
import { PersonalCartRoutingModule } from '../personal-cart/personal-cart-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { CustomDatePipe } from '../../../@core/pipes/custom-date.pipe';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TeamLogoComponent } from '../../../@shared/team-logo/team-logo.component';

@NgModule({
  declarations: [PersonalEventListComponent],
  imports: [
    CommonModule,
    PersonalEventRoutingModule,
    PersonalCartRoutingModule,
    DataViewModule,
    CustomDatePipe,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    MultiSelectModule,
    TeamLogoComponent,
  ],
})
export class PersonalEventModule {}

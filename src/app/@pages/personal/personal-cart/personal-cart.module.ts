import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalCartListComponent } from './personal-cart-list/personal-cart-list.component';
import { PersonalCartEditComponent } from './personal-cart-edit/personal-cart-edit.component';
import { PersonalCartRoutingModule } from './personal-cart-routing.module';
import { PersonalCartViewComponent } from './personal-cart-view/personal-cart-view.component';
import { CustomDatePipe } from '../../../@core/pipes/custom-date.pipe';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PersonalCartCreateComponent } from './personal-cart-create/personal-cart-create.component';
import { StepsModule } from 'primeng/steps';
import { CartCreatePaxComponent } from './personal-cart-create/cart-create-pax/cart-create-pax.component';
import { CartCreateAccomodationsComponent } from './personal-cart-create/cart-create-accomodations/cart-create-accomodations.component';
import { CartCreateRoadComponent } from './personal-cart-create/cart-create-road/cart-create-road.component';
import { CartCreateActivityComponent } from './personal-cart-create/cart-create-activity/cart-create-activity.component';
import { ButtonModule } from 'primeng/button';
import { ControlErrorsComponent } from 'src/app/@shared/control-errors/control-errors.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    PersonalCartListComponent,
    PersonalCartEditComponent,
    PersonalCartViewComponent,
    PersonalCartCreateComponent,
    CartCreatePaxComponent,
    CartCreateAccomodationsComponent,
    CartCreateRoadComponent,
    CartCreateActivityComponent,
  ],
  imports: [
    CommonModule,
    PersonalCartRoutingModule,
    CustomDatePipe,
    DividerModule,
    TableModule,
    StepsModule,
    ButtonModule,
    ControlErrorsComponent,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
  ],
})
export class PersonalCartModule {}

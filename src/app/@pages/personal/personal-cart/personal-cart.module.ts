import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalCartListComponent } from './personal-cart-list/personal-cart-list.component';
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
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';
import { RecapSharedComponent } from './personal-cart-create/recap-shared/recap-shared.component';
import { RecapComponent } from './personal-cart-create/recap/recap.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { ModalRoadComponent } from './personal-cart-create/cart-create-road/modal-road/modal-road.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PersonalCartCrateConfirmModalComponent } from './personal-cart-create/personal-cart-crate-confirm-modal/personal-cart-crate-confirm-modal.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TeamLogoComponent } from '../../../@shared/team-logo/team-logo.component';

@NgModule({
  declarations: [
    PersonalCartListComponent,
    PersonalCartViewComponent,
    PersonalCartCreateComponent,
    CartCreatePaxComponent,
    CartCreateAccomodationsComponent,
    CartCreateRoadComponent,
    CartCreateActivityComponent,
    RecapSharedComponent,
    RecapComponent,
    ModalRoadComponent,
    PersonalCartCrateConfirmModalComponent,
  ],
  providers: [DialogService, MessageService, ConfirmationService],
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
    CalendarModule,
    DropdownModule,
    DataViewModule,
    InputTextareaModule,
    MessagesModule,
    DynamicDialogModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    TeamLogoComponent,
  ],
})
export class PersonalCartModule {}

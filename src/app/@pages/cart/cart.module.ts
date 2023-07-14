import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartListComponent } from './cart-list/cart-list.component';
import { CartRoutingModule } from './cart-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { EntityListComponent } from 'src/app/@shared/entity-list/entity-list.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [CartListComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CustomDatePipe,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    KeyFilterModule,
    ConfirmDialogModule,
    SkeletonModule,
    DropdownModule,
    AutoCompleteModule,
    ChipModule,
    DividerModule,
    EntityListComponent,
    CalendarModule,
    InputNumberModule,
    OverlayPanelModule,
    InputSwitchModule,
  ],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class CartModule {}

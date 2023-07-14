import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelRoutingModule } from './hotel-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { EntityListComponent } from 'src/app/@shared/entity-list/entity-list.component';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { HotelModalComponent } from './hotel-modal/hotel-modal.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { HotelRoomsComponent } from './hotel-rooms/hotel-rooms.component';
import { HotelRoomsModalComponent } from './hotel-rooms/hotel-rooms-modal/hotel-rooms-modal.component';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    HotelListComponent,
    HotelModalComponent,
    HotelRoomsComponent,
    HotelRoomsModalComponent,
  ],
  imports: [
    CommonModule,
    HotelRoutingModule,
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
    OverlayPanelModule,
    InputNumberModule,
  ],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class HotelModule {}

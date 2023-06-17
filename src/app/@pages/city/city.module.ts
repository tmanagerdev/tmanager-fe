import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityRoutingModule } from './city-routing.module';
import { CityListComponent } from './city-list/city-list.component';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CityModalComponent } from './city-modal/city-modal.component';

@NgModule({
  declarations: [CityListComponent, CityModalComponent],
  imports: [
    CommonModule,
    CityRoutingModule,
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
  ],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class CityModule {}

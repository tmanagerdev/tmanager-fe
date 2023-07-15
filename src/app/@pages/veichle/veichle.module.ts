import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VeichleListComponent } from './veichle-list/veichle-list.component';
import { VeichleModalComponent } from './veichle-modal/veichle-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { CityRoutingModule } from './veichle-routing.module';

@NgModule({
  declarations: [VeichleListComponent, VeichleModalComponent],
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
    SkeletonModule,
    OverlayPanelModule,
  ],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class VeichleModule {}

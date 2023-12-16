import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceModalComponent } from './service-modal/service-modal.component';
import { ServiceRoutingModule } from './service-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { MessageService, ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [ServiceListComponent, ServiceModalComponent],
  imports: [
    CommonModule,
    ServiceRoutingModule,
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
export class ServiceModule {}

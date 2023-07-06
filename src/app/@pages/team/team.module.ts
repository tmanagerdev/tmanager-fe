import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamRoutingModule } from './team-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import { TeamModalComponent } from './team-modal/team-modal.component';
import { ImageUploaderComponent } from '../../@shared/image-uploader/image-uploader.component';

@NgModule({
  declarations: [TeamListComponent, TeamModalComponent],
  providers: [MessageService, ConfirmationService, DialogService],
  imports: [
    CommonModule,
    TeamRoutingModule,
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
    OverlayPanelModule,
    AutoCompleteModule,
    SkeletonModule,
    ImageUploaderComponent,
  ],
})
export class TeamModule {}

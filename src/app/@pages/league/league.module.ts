import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueListComponent } from './league-list/league-list.component';
import { LeagueRoutingModule } from './league-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LeagueModalComponent } from './league-modal/league-modal.component';

@NgModule({
  declarations: [LeagueListComponent, LeagueModalComponent],
  imports: [
    CommonModule,
    LeagueRoutingModule,
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
  ],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class LeagueModule {}

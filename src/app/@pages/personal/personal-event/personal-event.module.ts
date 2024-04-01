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
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';

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
    DropdownModule,
    DataViewModule,
    InputTextareaModule,
    MessagesModule,
    DynamicDialogModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    TeamLogoComponent,
    SkeletonModule,
    TableModule,
    OverlayPanelModule,
  ],
})
export class PersonalEventModule {}

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
import { TeamLogoComponent } from '../../@shared/team-logo/team-logo.component';
import { DropdownModule } from 'primeng/dropdown';
import { TeamPeopleComponent } from './team-people/team-people.component';
import { PeopleRolePipe } from 'src/app/@core/pipes/people-role.pipe';
import { TeamPeopleModalComponent } from './team-people/team-people-modal/team-people-modal.component';
import { TagRolePeopleComponent } from 'src/app/@shared/tag-role-people/tag-role-people.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    TeamListComponent,
    TeamModalComponent,
    TeamPeopleComponent,
    TeamPeopleModalComponent,
  ],
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
    PeopleRolePipe,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    KeyFilterModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    AutoCompleteModule,
    SkeletonModule,
    ImageUploaderComponent,
    TeamLogoComponent,
    DropdownModule,
    TagRolePeopleComponent,
    CalendarModule,
  ],
})
export class TeamModule {}

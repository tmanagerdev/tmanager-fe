import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { PeopleRolePipe } from 'src/app/@core/pipes/people-role.pipe';
import { TagRolePeopleComponent } from 'src/app/@shared/tag-role-people/tag-role-people.component';
import { ImageUploaderComponent } from '../../@shared/image-uploader/image-uploader.component';
import { TeamLogoComponent } from '../../@shared/team-logo/team-logo.component';
import { TeamCopyEntitiesComponent } from './team-copy-entities/team-copy-entities.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamModalComponent } from './team-modal/team-modal.component';
import { TeamPeopleModalComponent } from './team-people/team-people-modal/team-people-modal.component';
import { TeamPeopleComponent } from './team-people/team-people.component';
import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [
    TeamListComponent,
    TeamModalComponent,
    TeamPeopleComponent,
    TeamPeopleModalComponent,
    TeamCopyEntitiesComponent,
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
    CheckboxModule,
  ],
})
export class TeamModule {}

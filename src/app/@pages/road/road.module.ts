import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadListComponent } from './road-list/road-list.component';
import { RoadModalComponent } from './road-modal/road-modal.component';
import { RoadTeamsComponent } from './road-teams/road-teams.component';
import { RoadTeamsModalComponent } from './road-teams/road-teams-modal/road-teams-modal.component';
import { RoadRoutingModule } from './road-routing.module';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { CustomDatePipe } from 'src/app/@core/pipes/custom-date.pipe';
import { EntityListComponent } from 'src/app/@shared/entity-list/entity-list.component';
import { TeamLogoComponent } from 'src/app/@shared/team-logo/team-logo.component';
import { RoadVeichlesComponent } from './road-veichles/road-veichles.component';
import { RoadVeichlesModalComponent } from './road-veichles/road-veichles-modal/road-veichles-modal.component';

@NgModule({
  declarations: [
    RoadListComponent,
    RoadModalComponent,
    RoadTeamsComponent,
    RoadTeamsModalComponent,
    RoadVeichlesComponent,
    RoadVeichlesModalComponent,
  ],
  imports: [
    CommonModule,
    RoadRoutingModule,
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
    ToggleButtonModule,
    TeamLogoComponent,
  ],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class RoadModule {}

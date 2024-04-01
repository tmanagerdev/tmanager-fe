import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealComponent } from './meal.component';
import { MealRoutingModule } from './meal-routing.module';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MealModalComponent } from './meal-modal/meal-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { MealConfigModalComponent } from './meal-config-modal/meal-config-modal.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [MealComponent, MealModalComponent, MealConfigModalComponent],
  providers: [MessageService, ConfirmationService, DialogService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MealRoutingModule,
    PanelModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    ToggleButtonModule,
    OverlayPanelModule,
  ],
})
export class MealModule {}

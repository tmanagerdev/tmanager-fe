import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlErrorsComponent } from 'src/app/@shared/control-errors/control-errors.component';
import { AuthComponent } from './auth.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    SignInComponent,
    ResetPasswordComponent,
    RecoveryPasswordComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ControlErrorsComponent,
    ToastModule,
  ],
  providers: [MessageService],
})
export class AuthModule {}

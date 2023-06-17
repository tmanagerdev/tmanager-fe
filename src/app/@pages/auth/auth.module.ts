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

@NgModule({
  declarations: [
    SignInComponent,
    ResetPasswordComponent,
    RecoveryPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ControlErrorsComponent,
  ],
})
export class AuthModule {}

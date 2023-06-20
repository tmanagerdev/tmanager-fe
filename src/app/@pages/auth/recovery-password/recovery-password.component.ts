import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take, tap } from 'rxjs';
import { AuthApiService } from 'src/app/@core/api/auth-api.service';
import { markFormAsTouched } from 'src/app/@core/utils';
import { emailValidator } from 'src/app/@core/validators/email.validator';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
})
export class RecoveryPasswordComponent {
  recoveryForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator()]),
  });

  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private messageService: MessageService
  ) {}

  get email() {
    return this.recoveryForm.get('email') as FormControl;
  }

  get emailCensured() {
    const email = this.email.value ?? '';
    const [name, domain] = email.split('@');
    const censuredName = name
      .split('')
      .map((char: string, index: number) =>
        index < 1 || index === name.length - 1 ? char : '*'
      )
      .join('');
    const censuredDomain = domain
      .split('')
      .map((char: string, index: number) =>
        index < 1 || index === domain.length - 1 ? char : '*'
      )
      .join('');
    return `${censuredName}@${censuredDomain}`;
  }

  onSendMail() {
    if (this.recoveryForm.valid) {
      const user = { ...this.recoveryForm.value };
      this.authApiService
        .recoveryPassword(user)
        .pipe(
          take(1),
          tap((data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Mail inviata',
              detail: `Mail per il recupero della password inviata con successo all'indirizzo ${this.emailCensured}`,
            });
            this.recoveryForm.reset();
          })
        )
        .subscribe();
    } else {
      markFormAsTouched(this.recoveryForm);
    }
  }
}

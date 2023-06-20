import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { switchMap, take, tap } from 'rxjs';
import { AuthApiService } from 'src/app/@core/api/auth-api.service';
import { markFormAsTouched } from 'src/app/@core/utils';
import { emailValidator } from 'src/app/@core/validators/email.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  isValid: boolean = true;
  token: string = '';
  resetForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authApiService: AuthApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          this.token = params['token'];
          return this.authApiService.checkToken({ token: this.token });
        }),
        tap((data) => (this.isValid = data.valid))
      )
      .subscribe();
  }

  onResetPassword() {
    if (this.resetForm.valid) {
      const password = { ...this.resetForm.value, token: this.token };
      this.authApiService
        .resetPassword(password)
        .pipe(
          take(1),
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Password resettata',
            });
            this.router.navigate(['/auth', '/sign-in']);
          })
        )
        .subscribe();
    } else {
      markFormAsTouched(this.resetForm);
    }
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs';
import { AuthApiService } from 'src/app/@core/api/auth-api.service';
import { AuthService } from 'src/app/@core/services/auth.service';
import { markFormAsTouched } from 'src/app/@core/utils';
import { emailValidator } from 'src/app/@core/validators/email.validator';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator()]),
    password: new FormControl('', Validators.required),
  });
  credentialError: boolean = false;
  loading: boolean = false;

  constructor(
    private authApiService: AuthApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  get email() {
    return this.signInForm.get('email') as FormControl;
  }

  get password() {
    return this.signInForm.get('password') as FormControl;
  }

  onSignIn() {
    if (this.signInForm.valid) {
      this.loading = true;
      const user = { ...this.signInForm.value };
      this.authApiService
        .signIn(user)
        .pipe(
          take(1),
          tap((data) => {
            this.loading = true;
            this.authService.setCurrentUser(data);
            this.router.navigate(['/']);
          })
        )
        .subscribe();
    } else {
      markFormAsTouched(this.signInForm);
    }
  }

  onForgotPassword() {
    this.router.navigate(['auth', 'recovery-password']);
  }
}

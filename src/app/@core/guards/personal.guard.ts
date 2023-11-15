import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const PersonalGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser;
  if (user && user.role === 'USER') {
    return true;
  } else {
    return router.createUrlTree(['/league']);
  }
};

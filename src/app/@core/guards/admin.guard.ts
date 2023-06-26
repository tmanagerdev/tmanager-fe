import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser;
  if (user && user.role === 'ADMIN') {
    return true;
  } else {
    return router.createUrlTree(['/personal']);
  }
};

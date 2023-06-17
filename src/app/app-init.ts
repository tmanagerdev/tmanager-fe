import { AuthService } from './@core/services/auth.service';

export function appInit(as: AuthService) {
  return () => as.initializeUser();
}

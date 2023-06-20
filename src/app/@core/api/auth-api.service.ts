import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private httpClient: HttpClient) {}

  signIn(loginData: any): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/auth/sign-in`,
      loginData
    );
  }

  checkToken(token: any): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/auth/check-token`,
      token
    );
  }

  recoveryPassword(recoveryData: any): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/auth/recovery-password`,
      recoveryData
    );
  }

  resetPassword(resetData: any): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/auth/recovery-password`,
      resetData
    );
  }
}

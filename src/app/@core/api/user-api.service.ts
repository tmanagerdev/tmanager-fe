import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    email = '',
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/users`, {
      params: {
        page,
        take,
        ...(email ? { email } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/users/${userId}`);
  }

  create(user: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/users`, user);
  }

  update(id: string, user: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/users/${id}`, user);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/users/${id}`);
  }
}

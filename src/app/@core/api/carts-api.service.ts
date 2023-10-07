import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    team,
    user,
    complete,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/carts`, {
      params: {
        page,
        take,
        ...(team ? { team } : null),
        ...(user ? { user } : null),
        ...(complete ? { complete } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(cityId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/carts/${cityId}`);
  }

  create(city: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/carts`, city);
  }

  update(id: number, city: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/carts/${id}`, city);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/carts/${id}`);
  }

  copyLastRooming(team: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/carts/last-roomings`, {
      params: {
        team,
      },
    });
  }
}

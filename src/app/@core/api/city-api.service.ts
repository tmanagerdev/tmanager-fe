import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CityApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name = '',
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/cities`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(cityId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/cities/${cityId}`);
  }

  create(city: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/cities`, city);
  }

  update(id: string, city: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/cities/${id}`, city);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/cities/${id}`);
  }
}

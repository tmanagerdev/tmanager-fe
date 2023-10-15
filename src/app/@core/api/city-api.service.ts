import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/base.model';
import { ICity } from '../models/city.model';

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
  }: any): Observable<ApiResponse<Partial<ICity>>> {
    return this.httpClient.get(`${environment.apiUrl}/cities`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(cityId: number): Observable<Partial<ICity>> {
    return this.httpClient.get(`${environment.apiUrl}/cities/${cityId}`);
  }

  create(city: Partial<ICity>): Observable<Partial<ICity>> {
    return this.httpClient.post(`${environment.apiUrl}/cities`, city);
  }

  update(id: number, city: Partial<ICity>): Observable<Partial<ICity>> {
    return this.httpClient.put(`${environment.apiUrl}/cities/${id}`, city);
  }

  delete(id: number): Observable<Partial<ICity>> {
    return this.httpClient.delete(`${environment.apiUrl}/cities/${id}`);
  }
}

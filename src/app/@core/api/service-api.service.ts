import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/base.model';
import { ICity } from '../models/city.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name = '',
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/services`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(cityId: number): Observable<Partial<any>> {
    return this.httpClient.get(`${environment.apiUrl}/services/${cityId}`);
  }

  create(city: Partial<any>): Observable<Partial<any>> {
    return this.httpClient.post(`${environment.apiUrl}/services`, city);
  }

  update(id: number, city: Partial<any>): Observable<Partial<any>> {
    return this.httpClient.put(`${environment.apiUrl}/services/${id}`, city);
  }

  delete(id: number): Observable<Partial<any>> {
    return this.httpClient.delete(`${environment.apiUrl}/services/${id}`);
  }
}

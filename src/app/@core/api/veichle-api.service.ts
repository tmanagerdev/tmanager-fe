import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VeichleApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/veichles`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(veichleId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/veichles/${veichleId}`);
  }

  create(veichle: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/veichles`, veichle);
  }

  update(id: string, veichle: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/veichles/${id}`, veichle);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/veichles/${id}`);
  }
}
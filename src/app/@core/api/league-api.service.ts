import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeagueApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name = '',
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/leagues`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(leagueId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/leagues/${leagueId}`);
  }

  create(league: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/leagues`, league);
  }

  update(id: string, league: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/leagues/${id}`, league);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/leagues/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name = '',
    league = 0,
    city = 0,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/teams`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(league ? { league } : null),
        ...(city ? { city } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(teamId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/teams/${teamId}`);
  }

  create(team: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/teams`, team);
  }

  update(id: string, team: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/teams/${id}`, team);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/teams/${id}`);
  }
}

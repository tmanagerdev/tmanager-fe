import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/base.model';
import { ITeam } from '../models/team.model';
import { IPeople } from '../models/people.model';

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
  }: any): Observable<ApiResponse<ITeam>> {
    return this.httpClient.get(`${environment.apiUrl}/teams`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(league ? { league } : null),
        ...(city ? { city } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(teamId: number): Observable<Partial<ITeam>> {
    return this.httpClient.get(`${environment.apiUrl}/teams/${teamId}`);
  }

  create(team: Partial<ITeam>): Observable<Partial<ITeam>> {
    return this.httpClient.post(`${environment.apiUrl}/teams`, team);
  }

  update(id: number, team: Partial<ITeam>): Observable<Partial<ITeam>> {
    return this.httpClient.put(`${environment.apiUrl}/teams/${id}`, team);
  }

  delete(id: number): Observable<Partial<ITeam>> {
    return this.httpClient.delete(`${environment.apiUrl}/teams/${id}`);
  }

  findPeople(teamId: number): Observable<ApiResponse<Partial<ITeam>>> {
    return this.httpClient.get(
      `${environment.apiUrl}/teams/${teamId}/people`
    ) as any;
  }

  createPeople(people: Partial<IPeople>): Observable<Partial<IPeople>> {
    return this.httpClient.post(`${environment.apiUrl}/people`, people);
  }

  updatePeople(
    id: number,
    people: Partial<IPeople>
  ): Observable<Partial<IPeople>> {
    return this.httpClient.put(`${environment.apiUrl}/people/${id}`, people);
  }

  deletePeople(id: number): Observable<Partial<IPeople>> {
    return this.httpClient.delete(`${environment.apiUrl}/people/${id}`);
  }
}

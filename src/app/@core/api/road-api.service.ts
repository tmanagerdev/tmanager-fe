import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IActivity } from '../models/activity.model';
import { ApiResponse } from '../models/base.model';
import { IRoad } from '../models/road.model';

@Injectable({
  providedIn: 'root',
})
export class RoadApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    search,
    city,
    teams,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<ApiResponse<IRoad>> {
    return this.httpClient.get(`${environment.apiUrl}/roads`, {
      params: {
        page,
        take,
        ...(search ? { search } : null),
        ...(city ? { city } : null),
        ...(teams ? { teams } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(roadId: number): Observable<Partial<IRoad>> {
    return this.httpClient.get(`${environment.apiUrl}/roads/${roadId}`);
  }

  create(road: Partial<IRoad>): Observable<Partial<IRoad>> {
    return this.httpClient.post(`${environment.apiUrl}/roads`, road);
  }

  update(id: number, road: Partial<IRoad>): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/roads/${id}`, road);
  }

  delete(id: number): Observable<Partial<IRoad>> {
    return this.httpClient.delete(`${environment.apiUrl}/roads/${id}`);
  }

  addTeam(roadId: number, teamId: number): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/roads/${roadId}/add-team`,
      {
        teamId,
      }
    );
  }

  removeTeam(roadId: number, roadTeamId: any): Observable<any> {
    return this.httpClient.delete(
      `${environment.apiUrl}/roads/${roadId}/remove-team/${roadTeamId}`
    );
  }

  addRoadVeichle(
    roadId: number,
    veichleId: number,
    price: number
  ): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/roads/veichles`, {
      roadId,
      veichleId,
      price,
    });
  }

  removeRoadVeichle(roadVeichleId: any): Observable<any> {
    return this.httpClient.delete(
      `${environment.apiUrl}/roads/veichles/${roadVeichleId}`
    );
  }
}

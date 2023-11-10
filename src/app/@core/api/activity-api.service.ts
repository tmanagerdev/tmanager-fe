import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { IActivity } from '../models/activity.model';
import { ApiResponse } from '../models/base.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name,
    city,
    startDate,
    endDate,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<ApiResponse<IActivity>> {
    return this.httpClient.get(`${environment.apiUrl}/activities`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(city ? { city } : null),
        ...(startDate ? { startDate } : null),
        ...(endDate ? { endDate } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(activityId: number): Observable<Partial<IActivity>> {
    return this.httpClient.get(
      `${environment.apiUrl}/activities/${activityId}`
    );
  }

  create(activity: Partial<IActivity>): Observable<Partial<IActivity>> {
    return this.httpClient.post(`${environment.apiUrl}/activities`, activity);
  }

  update(id: number, activity: Partial<IActivity>): Observable<any> {
    return this.httpClient.put(
      `${environment.apiUrl}/activities/${id}`,
      activity
    );
  }

  delete(id: number): Observable<Partial<IActivity>> {
    return this.httpClient.delete(`${environment.apiUrl}/activities/${id}`);
  }

  addTeam(activityId: number, teamId: number): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/activities/${activityId}/add-team`,
      {
        teamId,
      }
    );
  }

  removeTeam(activityId: number, activityTeamId: any): Observable<any> {
    return this.httpClient.delete(
      `${environment.apiUrl}/activities/${activityId}/remove-team/${activityTeamId}`
    );
  }
}

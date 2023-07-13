import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

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
  }: any): Observable<any> {
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
    });
  }

  findOne(activityId: string): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}/activities/${activityId}`
    );
  }

  create(activity: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/activities`, activity);
  }

  update(id: string, activity: any): Observable<any> {
    return this.httpClient.put(
      `${environment.apiUrl}/activities/${id}`,
      activity
    );
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/activities/${id}`);
  }
}

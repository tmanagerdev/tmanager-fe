import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CalendarApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name = '',
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/calendars`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(calendarId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/calendars/${calendarId}`);
  }

  create(city: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/calendars`, city);
  }

  update(id: string, city: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/calendars/${id}`, city);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/calendars/${id}`);
  }

  findEvents(id: number, { day = 1 }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/calendars/${id}/events`, {
      params: {
        ...(day ? { day } : null),
      },
    });
  }
}

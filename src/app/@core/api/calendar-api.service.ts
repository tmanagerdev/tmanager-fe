import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/base.model';
import { ICalendar } from '../models/calendar.model';
import { IEvent } from '../models/event.model';

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
  }: any): Observable<ApiResponse<ICalendar>> {
    return this.httpClient.get(`${environment.apiUrl}/calendars`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(calendarId: number): Observable<Partial<ICalendar>> {
    return this.httpClient.get(`${environment.apiUrl}/calendars/${calendarId}`);
  }

  create(calendar: Partial<ICalendar>): Observable<Partial<ICalendar>> {
    return this.httpClient.post(`${environment.apiUrl}/calendars`, calendar);
  }

  update(
    id: number,
    calendar: Partial<ICalendar>
  ): Observable<Partial<ICalendar>> {
    return this.httpClient.put(
      `${environment.apiUrl}/calendars/${id}`,
      calendar
    );
  }

  delete(id: number): Observable<Partial<ICalendar>> {
    return this.httpClient.delete(`${environment.apiUrl}/calendars/${id}`);
  }

  findEvents(
    id: number,
    { day = 1 }: Partial<IEvent>
  ): Observable<Partial<ICalendar>[]> {
    return this.httpClient.get(`${environment.apiUrl}/calendars/${id}/events`, {
      params: {
        ...(day ? { day } : null),
      },
    }) as any;
  }
}

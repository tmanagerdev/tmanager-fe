import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/base.model';
import { IEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    day,
    date,
    type,
    team,
    calendar,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<ApiResponse<IEvent>> {
    return this.httpClient.get(`${environment.apiUrl}/events`, {
      params: {
        page,
        take,
        ...(day ? { day } : null),
        ...(date ? { date } : null),
        ...(type ? { type } : null),
        ...(team ? { team } : null),
        ...(calendar ? { calendar } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(eventId: number): Observable<Partial<IEvent>> {
    return this.httpClient.get(`${environment.apiUrl}/events/${eventId}`);
  }

  create(event: Partial<IEvent>): Observable<Partial<IEvent>> {
    return this.httpClient.post(`${environment.apiUrl}/events`, event);
  }

  update(id: number, event: Partial<IEvent>): Observable<Partial<IEvent>> {
    return this.httpClient.put(`${environment.apiUrl}/events/${id}`, event);
  }

  delete(id: number): Observable<Partial<IEvent>> {
    return this.httpClient.delete(`${environment.apiUrl}/events/${id}`);
  }
}

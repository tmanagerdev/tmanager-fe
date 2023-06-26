import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

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
  }: any): Observable<any> {
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
    });
  }

  findOne(eventId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/events/${eventId}`);
  }

  create(event: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/events`, event);
  }

  update(id: string, event: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/events/${id}`, event);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/events/${id}`);
  }
}

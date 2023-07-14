import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HotelApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    name,
    city,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/hotels`, {
      params: {
        page,
        take,
        ...(name ? { name } : null),
        ...(city ? { city } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    });
  }

  findOne(hotelId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/hotels/${hotelId}`);
  }

  create(hotel: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/hotels`, hotel);
  }

  update(id: string, hotel: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/hotels/${id}`, hotel);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/hotels/${id}`);
  }

  createRoom(hotelId: number, room: any): Observable<any> {
    return this.httpClient.put(
      `${environment.apiUrl}/hotels/${hotelId}/add`,
      room
    );
  }

  updateRoom(hotelId: number, roomId: any, room: any): Observable<any> {
    return this.httpClient.put(
      `${environment.apiUrl}/hotels/${hotelId}/update/${roomId}`,
      room
    );
  }

  deleteRoom(hotelId: number, roomId: any): Observable<any> {
    return this.httpClient.delete(
      `${environment.apiUrl}/hotels/${hotelId}/delete/${roomId}`
    );
  }
}

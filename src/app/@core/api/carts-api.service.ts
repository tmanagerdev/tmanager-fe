import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/base.model';
import { ICart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    team,
    user,
    status,
    complete,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<ApiResponse<Partial<ICart>>> {
    return this.httpClient.get(`${environment.apiUrl}/carts`, {
      params: {
        page,
        take,
        ...(team ? { team } : null),
        ...(user ? { user } : null),
        ...(complete ? { complete } : null),
        ...(status ? { status } : null),
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  findOne(cartId: number): Observable<Partial<ICart>> {
    return this.httpClient.get(`${environment.apiUrl}/carts/${cartId}`);
  }

  create(cart: Partial<ICart>): Observable<Partial<ICart>> {
    return this.httpClient.post(`${environment.apiUrl}/carts`, cart);
  }

  update(id: number, cart: Partial<ICart>): Observable<Partial<ICart>> {
    return this.httpClient.put(`${environment.apiUrl}/carts/${id}`, cart);
  }

  delete(id: number): Observable<Partial<ICart>> {
    return this.httpClient.delete(`${environment.apiUrl}/carts/${id}`);
  }

  copyLastRooming(team: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/carts/last-rooming`, {
      params: {
        team,
      },
    });
  }

  downloadPdf(id: number): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.httpClient.get(
      `${environment.apiUrl}/carts/${id}/pdf`,
      httpOptions
    );
  }

  setBudget(cartId: number, budget: number) {
    return this.httpClient.post(
      `${environment.apiUrl}/carts/${cartId}/budget`,
      {
        budget,
      }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/base.model';
import { IMeal, IMealConfig } from '../models/meal.model';

@Injectable({
  providedIn: 'root',
})
export class MealApiService {
  constructor(private httpClient: HttpClient) {}

  findAll({
    page,
    take,
    sortField = '',
    sortOrder = 1,
  }: any): Observable<ApiResponse<IMeal>> {
    return this.httpClient.get(`${environment.apiUrl}/meals`, {
      params: {
        page,
        take,
        ...(sortField ? { sortField, sortOrder } : null),
      },
    }) as any;
  }

  create(meal: Partial<IMeal>): Observable<Partial<IMeal>> {
    return this.httpClient.post(`${environment.apiUrl}/meals`, meal);
  }

  update(id: number, meal: Partial<IMeal>): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/meals/${id}`, meal);
  }

  delete(id: number): Observable<Partial<IMeal>> {
    return this.httpClient.delete(`${environment.apiUrl}/meals/${id}`);
  }

  createConfig(mealId: number, config: Partial<IMealConfig>): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/meals/${mealId}/create-config`,
      config
    );
  }

  updateConfig(
    configId: number,
    config: Partial<IMealConfig>
  ): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/meals/update-config/${configId}`,
      config
    );
  }

  deleteConfig(configId: number): Observable<any> {
    return this.httpClient.delete(
      `${environment.apiUrl}/meals/delete-config/${configId}`
    );
  }
}

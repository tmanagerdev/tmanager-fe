import { ICity } from './city.model';

export interface IActivity {
  id: number;
  name: string;
  description: string;
  price: number;
  cityId: number;
  city: ICity;
  startDate: string;
  endDate: string;
}

export interface IActivitiesOnCart {
  id: number;
  cartId: number;
  activityId: number;
  startDate: string;
  quantity: number;
}

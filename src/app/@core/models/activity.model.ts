import { ICity } from './city.model';
import { ITeam } from './team.model';

export interface IActivity {
  id: number;
  name: string;
  description: string;
  price: number;
  cityId: number;
  city: ICity;
  startDate: string;
  endDate: string;
  teams: ITeam[];
}

export interface IActivitiesOnCart {
  id: number;
  cartId: number;
  activityId: number;
  startDate: string;
  quantity: number;
}

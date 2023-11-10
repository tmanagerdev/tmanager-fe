import { ICity } from './city.model';
import { ITeam } from './team.model';
import { IVeichle } from './veichle.model';

export interface IRoad {
  id: number;
  from: string;
  to: string;
  price: number;
  cityId: number;
  city: ICity;
  teams: ITeam[];
}

export interface IRoadsOnCarts {
  id: number;
  cartId: number;
  roadId: number;
  quantity: number;
  startDate: string;
}

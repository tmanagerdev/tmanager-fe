import { ICity } from './city.model';
import { ITeam } from './team.model';
import { IVeichle } from './veichle.model';

export interface IRoad {
  id: number;
  from: string;
  to: string;
  price: number;
  cityId: number;
  veichleId: number;
  city: ICity;
  veichle: IVeichle;
  teams: ITeam[];
  roadsVeichles: any;
}

export interface IRoadsOnCarts {
  id: number;
  road: IRoad;
  veichle: IVeichle;
  quantity: number;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  roadsVeichles: any;
}

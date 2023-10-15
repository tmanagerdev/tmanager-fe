import { IActivity } from './activity.model';
import { IHotel } from './hotel.model';
import { ITeam } from './team.model';
import { IVeichle } from './veichle.model';

export interface ICity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  teams: Partial<ITeam>[];
  activities: Partial<IActivity>[];
  hotels: Partial<IHotel>[];
  veichles: Partial<IVeichle>[];
}

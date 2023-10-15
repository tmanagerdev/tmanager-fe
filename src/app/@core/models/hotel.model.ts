import { ICity } from './city.model';
import { IMeal } from './meal.model';
import { IRoom } from './room.model';

export interface IHotel {
  id: number;
  name: string;
  cityId: number;
  city: Partial<ICity>;
  rooms: Partial<IRoom>[];
  meals: Partial<IMeal>[];
}

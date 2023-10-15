import { ICity } from './city.model';
import { IRoad } from './road.model';

export interface IVeichle {
  id: number;
  name: string;
  cityId: number;
  city: Partial<ICity>;
  roads: Partial<IRoad>[];
}

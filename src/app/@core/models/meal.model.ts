import { ICart } from './cart.model';
import { IHotel } from './hotel.model';

export interface IMeal {
  id: number;
  name: string;
  price: number;
  maxConfigActive: number;
  config: IMealConfig[];
}

export interface IMealConfig {
  id: number;
  name: string;
  active: boolean;
  requireDescription: boolean;
}

export interface IMealsOnCarts {
  id: number;
  quantity: number;
  startDate: string;
  description: string;
}

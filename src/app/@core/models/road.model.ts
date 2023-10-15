import { IVeichle } from './veichle.model';

export interface IRoad {
  id: number;
  from: string;
  to: string;
  price: number;
  veichleId: number;
  veichle: IVeichle;
}

export interface IRoadsOnCarts {
  id: number;
  cartId: number;
  roadId: number;
  quantity: number;
  startDate: string;
}

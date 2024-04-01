import { ICart } from './cart.model';
import { IPeople } from './people.model';
import { IRooming } from './rooming.model';

export enum ENameRoom {
  SINGLE = 'S',
  DOUBLE = 'D',
  DOUBLEUSESINGLE = 'DUS',
  TRIPLE = 'T',
}

export const namesRoom = [
  { value: ENameRoom.SINGLE, label: 'Singola' },
  { value: ENameRoom.DOUBLE, label: 'Doppia' },
  { value: ENameRoom.DOUBLEUSESINGLE, label: 'Doppia uso singola' },
  { value: ENameRoom.TRIPLE, label: 'Tripla' },
];

export interface IRoom {
  id: number;
  name: ENameRoom;
  hotel: any;
  hotelId: number;
  price: number;
  numPax: number;
}

export interface IRoomsOnCarts {
  id: number;
  cartId: number;
  roomId: number;
  cart: ICart;
  room: IRoom;
  rooming: IRooming[];
}

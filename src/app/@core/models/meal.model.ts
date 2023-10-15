import { ICart } from './cart.model';
import { IHotel } from './hotel.model';

export interface IMeal {
  id: number;
  name: string;
  hotelId: number;
  hotel: Partial<IHotel>;
}

export interface IMealsOnCarts {
  id: number;
  cartId: number;
  mealId: number;
  quantity: number;
  startDate: string;
  cart: Partial<ICart>;
}

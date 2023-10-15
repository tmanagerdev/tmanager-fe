import { IPeople } from './people.model';

export interface IRooming {
  id: number;
  roomOnCartId: number;
  peopleId: number;
  room: any;
  people: IPeople[];
  name: string;
  surname: string;
  category: string;
}

import { ICart } from './cart.model';
import { IEvent } from './event.model';
import { IPeople } from './people.model';

export interface ITeam {
  id: number;
  name: string;
  logoUrl: string;
  logoId: string;
  league: any;
  leagueId: number;
  city: any;
  cityId: number;
  calendarHome: IEvent[];
  calendarAway: IEvent[];
  users: any;
  carts: ICart[];
  people: IPeople[];
}

export interface ITeamCopyEntites {
  from: number;
  to: number;
  hotel: boolean;
  activity: boolean;
  road: boolean;
}

import { ICart } from './cart.model';
import { ITeam } from './team.model';

export interface IUser {
  id: number;
  email: string;
  password: string;
  image: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
  teams: Partial<IUsersOnTeams>[];
  carts: Partial<ICart>[];
}

export interface IUsersOnTeams {
  id: number;
  user: IUser;
  userId: number;
  team: Partial<ITeam>;
  teamId: number;
}

import { IActivitiesOnCart } from './activity.model';
import { IEvent } from './event.model';
import { IMealsOnCarts } from './meal.model';
import { IPeople } from './people.model';
import { IRoadsOnCarts } from './road.model';
import { IRoomsOnCarts } from './room.model';
import { ITeam } from './team.model';

export enum EStatusCart {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DEPOSIT = 'DEPOSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const statusCart = [
  { value: EStatusCart.DRAFT, label: 'Bozza' },
  { value: EStatusCart.PENDING, label: 'Presa in carico' },
  { value: EStatusCart.CONFIRMED, label: 'Confermata' },
  { value: EStatusCart.DEPOSIT, label: 'Acconto pagato' },
  { value: EStatusCart.COMPLETED, label: 'Completata' },
  { value: EStatusCart.CANCELLED, label: 'Annullata' },
];

export interface ICart {
  accomodationNotes: string;
  activities: Partial<IActivitiesOnCart>[];
  completedAt: string;
  confirmedAt: string;
  createdAt: string;
  depositAt: string;
  endDate: string;
  equipments: number;
  event: Partial<IEvent>;
  genericNotes: string;
  id: number;
  managers: number;
  meals: Partial<IMealsOnCarts>[];
  others: number;
  pendingAt: string;
  players: number;
  roadNotes: string;
  roads: Partial<IRoadsOnCarts>[];
  rooms: Partial<IRoomsOnCarts>[];
  staffs: number;
  startDate: string;
  status: EStatusCart;
  team: Partial<ITeam>;
  userId: number;
  people: IPeople[];
  onlyStatus?: boolean;
}

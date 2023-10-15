import { ITeam } from './team.model';

export interface IEvent {
  id: number;
  day: number;
  date: string;
  away: ITeam;
  home: ITeam;
  calendar: any;
}

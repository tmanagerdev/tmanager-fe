import { ICalendar } from './calendar.model';
import { ITeam } from './team.model';

export interface ILeague {
  id: number;
  name: string;
  teams: ITeam[];
  calendar: ICalendar[];
}

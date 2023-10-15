import { IEvent } from './event.model';
import { ILeague } from './league.model';

export interface ICalendar {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  league: ILeague;
  leagueId: number;
  dates: number;
  calendarEvents: IEvent[];
}

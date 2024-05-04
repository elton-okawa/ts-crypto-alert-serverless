import {
  subHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  subDays,
  subWeeks,
  subMonths,
} from 'date-fns/fp';
import { compose } from 'lodash/fp';

export enum Period {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export const PeriodHelper = {
  getDate(period: Period, reference: Date): Date {
    return periodToDate[period](reference);
  },
};

const periodToDate: Record<Period, (ref: Date) => Date> = {
  [Period.HOURLY]: compose(
    subHours(1),
    setMinutes(0),
    setSeconds(0),
    setMilliseconds(0),
  ),
  [Period.DAILY]: compose(subDays(1)),
  [Period.WEEKLY]: compose(subWeeks(1)),
  [Period.MONTHLY]: compose(subMonths(1)),
};

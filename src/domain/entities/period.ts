import {
  subHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  subDays,
  subWeeks,
  subMonths,
  subYears,
} from 'date-fns/fp';
import { compose } from 'lodash/fp';

export enum Period {
  HOURLY = 'HOURLY',
  HOURS_3 = 'HOURS_3',
  HOURS_6 = 'HOURS_6',
  HOURS_12 = 'HOURS_12',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  YEARLY = 'YEARLY',
}

export const PeriodHelper = {
  getDate(period: Period, reference: Date): Date {
    return periodToDate[period](reference);
  },
};

const hoursCompose = (amount: number) =>
  compose(subHours(amount), setMinutes(0), setSeconds(0), setMilliseconds(0));

const periodToDate: Record<Period, (ref: Date) => Date> = {
  [Period.HOURLY]: hoursCompose(1),
  [Period.HOURS_3]: hoursCompose(3),
  [Period.HOURS_6]: hoursCompose(6),
  [Period.HOURS_12]: hoursCompose(12),
  [Period.DAILY]: compose(subDays(1)),
  [Period.WEEKLY]: compose(subWeeks(1)),
  [Period.MONTHLY]: compose(subMonths(1)),
  [Period.QUARTERLY]: compose(subMonths(3)),
  [Period.SEMI_ANNUAL]: compose(subMonths(6)),
  [Period.YEARLY]: compose(subYears(1)),
};

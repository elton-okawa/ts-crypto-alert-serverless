import { Period } from './period';
import { toMap } from '@src/lib';
import { subHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns/fp';
import { compose } from 'lodash/fp';
import { Entity, ValueObject } from '@src/domain/core';

export class Alert extends Entity {
  static readonly TABLE = 'alert';

  symbol: string;
  percentages: PercentageAlert[];

  private percentageByPeriod: Record<Period, PercentageAlert>;

  constructor(params: Partial<Alert>) {
    super(params);

    this.symbol = params.symbol;
    this.percentages = PercentageAlert.createMany(params.percentages);
    this.percentageByPeriod = toMap(params.percentages, 'period');
  }

  getPercentage(period: Period, referenceDate: Date): AlertParams {
    return {
      ...this.percentageByPeriod[period],
      fromDate: this.calculateFromDate(referenceDate),
    };
  }

  private calculateFromDate(reference: Date): Date {
    return compose(
      subHours(1),
      setMinutes(0),
      setSeconds(0),
      setMilliseconds(0),
    )(reference);
  }
}

export class PercentageAlert extends ValueObject {
  period: Period;
  difference: number;

  constructor(params: Partial<PercentageAlert>) {
    super();

    this.period = params.period;
    this.difference = params.difference;
  }

  triggered(value: number): boolean {
    return Math.abs(value) >= this.difference;
  }
}

export type AlertParams = {
  period: Period;
  difference: number;
  fromDate: Date;
};

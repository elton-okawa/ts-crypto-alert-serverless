import { Period } from './period';
import { toMap } from '@src/lib';
import { subHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns/fp';
import { compose } from 'lodash/fp';
import { Entity } from '@src/domain/core';
import { PercentageAlert, PercentageAlertParams } from './percentage-alert.vo';
import { PriceAlert, PriceAlertParams } from './price-alert.vo';

export type AlertParams = Entity & {
  symbol: string;
  percentages: PercentageAlertParams[];
  price: PriceAlertParams;
};

export class Alert extends Entity {
  static readonly TABLE = 'alert';

  symbol: string;
  percentages: PercentageAlert[];
  price: PriceAlert | null;

  private percentageByPeriod: Record<Period, PercentageAlert>;

  constructor(params: AlertParams) {
    super(params);

    this.symbol = params.symbol;
    this.percentages = params.percentages
      ? PercentageAlert.createMany(params.percentages)
      : [];
    this.percentageByPeriod = toMap(this.percentages, 'period');
    this.price = params.price ? PriceAlert.create(params.price) : null;
  }

  getPercentage(period: Period, referenceDate: Date) {
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

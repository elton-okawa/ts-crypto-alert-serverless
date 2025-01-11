import { BaseAlert, BaseAlertParams } from './base-alert.vo';
import { Period } from './period';

export type PercentageAlertParams = BaseAlertParams & {
  period: Period;
  difference: number;
};

export class PercentageAlert extends BaseAlert<number> {
  period: Period;
  difference: number;

  constructor(params: PercentageAlertParams) {
    super(params);

    this.period = params.period;
    this.difference = params.difference;
  }

  triggered(value: number): boolean {
    return Math.abs(value) >= this.difference;
  }
}

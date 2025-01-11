import { Decision } from '../types';
import { BaseAlert, BaseAlertParams } from './base-alert.vo';

export type PriceAlertParams = BaseAlertParams & {
  min: number;
  max: number;
};

export class PriceAlert extends BaseAlert<number> {
  min: number;
  max: number;

  constructor(params: Partial<PriceAlertParams>) {
    super(params);

    this.min = params.min;
    this.max = params.max;
  }

  triggered(value: number): boolean {
    return value <= this.min || value >= this.max;
  }

  decision(value: number): Decision {
    if (value <= this.min) {
      return Decision.Buy;
    } else if (value >= this.max) {
      return Decision.Sell;
    } else {
      return Decision.Keep;
    }
  }
}

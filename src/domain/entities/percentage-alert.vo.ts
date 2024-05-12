import { ValueObject } from '@src/domain/core';
import { Period } from './period';
import { Cooldown } from './cooldown.vo';

export type PercentageAlertParams = Omit<PercentageAlert, 'cooldown'> & {
  cooldown: string;
};

export class PercentageAlert extends ValueObject {
  period: Period;
  difference: number;
  readonly cooldown: Cooldown;

  constructor(params: PercentageAlertParams) {
    super();

    this.period = params.period;
    this.difference = params.difference;
    this.cooldown = Cooldown.create(params.cooldown);
  }

  triggered(value: number): boolean {
    return Math.abs(value) >= this.difference;
  }
}

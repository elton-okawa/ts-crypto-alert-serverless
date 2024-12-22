import { Interval } from '@src/domain';
import { Entity } from '../domain/core';
import { ThresholdConfig } from './types';

export class AutomatedOrderConfig extends Entity {
  public static TABLE = 'automated-order-configs';
  code: string;
  interval: Interval;
  thresholds: ThresholdConfig;

  constructor(params: Partial<AutomatedOrderConfig>) {
    super(params);

    this.code = params.code;
    this.interval = params.interval;
    this.thresholds = params.thresholds;
  }
}

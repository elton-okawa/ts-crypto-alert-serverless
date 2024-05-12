import { Entity } from '@src/domain/core';
import { Period } from './period';
import { Cooldown } from './cooldown.vo';

const COOLDOWN_DELTA_MS = 300000;

export class Cryptocurrency extends Entity {
  static readonly TABLE = 'cryptocurrency';

  name: string;
  symbol: string;
  historicalData: boolean | null;
  updatedAt: Date | null;

  readonly lastAlerts: {
    percentage?: Partial<Record<Period, Date>>;
  };

  constructor(params: Partial<Cryptocurrency>) {
    super(params);

    this.name = params.name;
    this.symbol = params.symbol;
    this.historicalData = params.historicalData ?? null;
    this.updatedAt = params.updatedAt ?? null;
    this.lastAlerts = params.lastAlerts ?? {};
  }

  canPercentageAlert(period: Period, cooldown: Cooldown): boolean {
    const lastExecution = this.lastAlerts?.percentage?.[period];
    if (!lastExecution) return true;

    return (
      lastExecution.getTime() + cooldown.milliseconds - COOLDOWN_DELTA_MS <=
      Date.now()
    );
  }

  percentageAlertSent(period: Period) {
    this.lastAlerts.percentage = this.lastAlerts.percentage ?? {};
    this.lastAlerts.percentage[period] = new Date();
  }
}

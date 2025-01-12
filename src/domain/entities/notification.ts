import { ValueObject } from '@src/domain/core';
import { CryptoPrice } from './crypto-price';
import { Period, PeriodHelper } from './period';
import { toMap, toMapArray } from '@src/lib';
import { Decision } from '../types';

export type PercentageByCrypto = Record<
  string,
  Record<Period, PercentageNotification>
>;

export class Notification extends ValueObject {
  percentages: PercentageNotification[];
  prices: PriceNotification[];

  get triggeredPercentages() {
    return this.percentages.filter((notification) =>
      notification.shouldNotify(),
    );
  }

  get percentageByCrypto(): PercentageByCrypto {
    const byCrypto = toMapArray(this.percentages, 'symbol');
    const grouped = Object.fromEntries(
      Object.entries(byCrypto).map(([symbol, percentages]) => {
        return [symbol, toMap(percentages, 'period')];
      }),
    );

    return grouped;
  }

  constructor(params: Partial<Notification>) {
    super();

    this.percentages = PercentageNotification.createMany(params.percentages);
    this.prices = PriceNotification.createMany(params.prices);
  }

  hasNotifications(): boolean {
    return (
      this.percentages.filter(
        (notification) => notification.triggered && !notification.cooldown,
      ).length > 0
    );
  }

  hasTriggeredNotifications(): boolean {
    return (
      this.percentages.filter((notification) => notification.triggered).length >
      0
    );
  }
}

class BaseNotification extends ValueObject {
  triggered: boolean;
  symbol: string;
  cooldown: boolean;

  constructor(params: Partial<BaseNotification>) {
    super();

    this.triggered = params.triggered;
    this.symbol = params.symbol;
    this.cooldown = params.cooldown;
  }

  shouldNotify() {
    return this.triggered && !this.cooldown;
  }
}

export class PercentageNotification extends BaseNotification {
  difference: number;
  period: Period;
  currentPrice: CryptoPrice;
  targetPrice: CryptoPrice;

  constructor({
    triggered,
    cooldown,
    symbol,
    ...params
  }: Partial<PercentageNotification>) {
    super({ cooldown, triggered, symbol });

    this.difference = params.difference;
    this.period = params.period;
    this.currentPrice = params.currentPrice;
    this.targetPrice = params.targetPrice;
  }
}

export type HistoricalPrice = {
  period: Period;
  min: number;
  max: number;
};

export class PriceNotification extends BaseNotification {
  price: number;
  min: number;
  max: number;
  streak: number;
  decision: Decision;
  // always sorted by period
  history: HistoricalPrice[];

  constructor({
    triggered,
    cooldown,
    symbol,
    ...params
  }: Partial<PriceNotification>) {
    super({ cooldown, triggered, symbol });

    this.price = params.price;
    this.min = params.min;
    this.max = params.max;
    this.streak = params.streak;
    this.decision = params.decision;
    this.history = params.history;
  }
}

import { ValueObject } from '@src/domain/core';
import { CryptoPrice } from './crypto-price';
import { Period } from './period';

export class Notification extends ValueObject {
  percentages: PercentageNotification[];

  get triggeredPercentages() {
    return this.percentages.filter((notification) =>
      notification.shouldNotify(),
    );
  }

  constructor(params: Partial<Notification>) {
    super();

    this.percentages = PercentageNotification.createMany(params.percentages);
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

import { ValueObject } from '@src/domain/core';
import { CryptoPrice } from './crypto-price';
import { Period } from './period';

export class Notification extends ValueObject {
  percentages: PercentageNotification[];

  constructor(params: Partial<Notification>) {
    super();

    this.percentages = PercentageNotification.createMany(params.percentages);
  }
}

export class PercentageNotification extends ValueObject {
  symbol: string;
  difference: number;
  period: Period;
  currentPrice: CryptoPrice;
  targetPrice: CryptoPrice;

  constructor(params: Partial<PercentageNotification>) {
    super();

    this.symbol = params.symbol;
    this.difference = params.difference;
    this.period = params.period;
    this.currentPrice = params.currentPrice;
    this.targetPrice = params.targetPrice;
  }
}

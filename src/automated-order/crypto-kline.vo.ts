import Decimal from 'decimal.js';
import { ValueObject } from '../domain/core';

export type CryptoKlineParams = {
  openTime: Date;
  closeTime: Date;
  openPrice: Decimal.Value;
  closePrice: Decimal.Value;
  highPrice: Decimal.Value;
  lowPrice: Decimal.Value;
  volume: Decimal.Value;
  quoteAssetVolume: Decimal.Value;
  trades: Decimal.Value;
  takerBuyBase: Decimal.Value;
  takerBuyQuote: Decimal.Value;
};

export class CryptoKline extends ValueObject {
  openTime: Date;
  closeTime: Date;
  openPrice: Decimal;
  closePrice: Decimal;
  highPrice: Decimal;
  lowPrice: Decimal;
  volume: Decimal;
  quoteAssetVolume: Decimal;
  trades: Decimal;
  takerBuyBase: Decimal;
  takerBuyQuote: Decimal;

  constructor(params: Partial<CryptoKlineParams>) {
    super();

    this.openTime = params.openTime;
    this.closeTime = params.closeTime;
    this.openPrice = new Decimal(params.openPrice);
    this.closePrice = new Decimal(params.closePrice);
    this.highPrice = new Decimal(params.highPrice);
    this.lowPrice = new Decimal(params.lowPrice);
    this.volume = new Decimal(params.volume);
    this.quoteAssetVolume = new Decimal(params.quoteAssetVolume);
    this.trades = new Decimal(params.trades);
    this.takerBuyBase = new Decimal(params.takerBuyBase);
    this.takerBuyQuote = new Decimal(params.takerBuyQuote);
  }

  /**
   * How much price has changed
   */
  get priceScore() {
    return this.closePrice.sub(this.openPrice).div(this.openPrice);
  }

  /**
   * How close it was to lose value
   * [-1, 0] Always negative, lower is better
   *
   * Measure momentum:
   * - when lowPrice ~= openPrice -> momentum is high, people are buying
   * - when lowPrice < openPrice -> momentum is uncertain, some are buying, some are selling
   */
  get lowScore() {
    return this.lowPrice.sub(this.openPrice).div(this.openPrice);
  }

  /**
   * How much near the value closed at the highest point
   * [0, 1] Always positive, lower is better
   *
   * Measure momentum:
   * - when highPrice ~= closePrice -> momentum is high, people are buying
   * - when highPrice > closePrice -> momentum is uncertain, some are buying, some are selling
   */
  get highScore() {
    return this.highPrice.sub(this.closePrice).div(this.closePrice);
  }
}

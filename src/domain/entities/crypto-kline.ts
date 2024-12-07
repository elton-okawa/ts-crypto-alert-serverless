import { Entity } from '@src/domain/core';

export class CryptoKline extends Entity {
  openTime: Date;
  closeTime: Date;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteAssetVolume: number;
  trades: number;
  takerBuyBase: number;
  takerBuyQuote: number;

  constructor(params: Partial<CryptoKline>) {
    super(params);

    this.openTime = params.openTime;
    this.closeTime = params.closeTime;
    this.openPrice = params.openPrice;
    this.closePrice = params.closePrice;
    this.highPrice = params.highPrice;
    this.lowPrice = params.lowPrice;
    this.volume = params.volume;
    this.quoteAssetVolume = params.quoteAssetVolume;
    this.trades = params.trades;
    this.takerBuyBase = params.takerBuyBase;
    this.takerBuyQuote = params.takerBuyQuote;
  }

  /**
   * How much price has changed
   */
  get priceScore() {
    return (this.closePrice - this.openPrice) / this.openPrice;
  }

  /**
   * How close it was to lose value
   * Always negative, lower is better (in absolute terms)
   *
   * Measure momentum:
   * - when lowPrice ~= openPrice -> momentum is high, people are buying
   * - when lowPrice < openPrice -> momentum is uncertain, some are buying, some are selling
   */
  get lowPriceScore() {
    return (this.lowPrice - this.openPrice) / this.openPrice;
  }

  /**
   * How much near the value closed at the highest point
   * Always negative, lower is better (in absolute terms)
   *
   * Measure momentum:
   * - when highPrice ~= closePrice -> momentum is high, people are buying
   * - when highPrice < closePrice -> momentum is uncertain, some are buying, some are selling
   */
  get highPriceScore() {
    return (this.closePrice - this.highPrice) / this.closePrice;
  }
}

import Decimal from 'decimal.js';
import { Entity } from '../domain/core';
import { CryptoKline } from './crypto-kline.vo';
import {
  ActionInfo,
  ThresholdConfig,
  Threshold,
  ScoreAction,
  EnablerAction,
} from './types';

export class AutomatedDecision extends Entity {
  public static TABLE = 'automated-decisions';
  public time: Date;
  public price: Decimal;
  public finalAction: number;
  public priceAction: ActionInfo;
  public highAction: ActionInfo;
  public lowAction: ActionInfo;

  public get buy() {
    return this.finalAction === ScoreAction.BUY;
  }

  public get sell() {
    return this.finalAction === ScoreAction.SELL;
  }

  public constructor(params: Partial<AutomatedDecision>) {
    super(params);

    this.time = params.time;
    this.price = params.price;
    this.finalAction = params.finalAction;
    this.priceAction = params.priceAction;
    this.highAction = params.highAction;
    this.lowAction = params.lowAction;
  }

  public static createFrom(kline: CryptoKline, thresholds: ThresholdConfig) {
    const priceAction = {
      value: kline.priceScore,
      action: AutomatedDecision.getScoreAction(
        kline.priceScore,
        thresholds.price,
      ),
    };
    const highAction = {
      value: kline.highScore,
      action: AutomatedDecision.getEnablerAction(
        kline.highScore,
        thresholds.high,
      ),
    };
    const lowAction = {
      value: kline.lowScore,
      action: AutomatedDecision.getEnablerAction(
        kline.lowScore,
        thresholds.low,
      ),
    };

    const time = kline.closeTime;
    const price = kline.closePrice;

    const shouldBuy = lowAction.action === EnablerAction.PERFORM;
    const shouldSell = highAction.action === EnablerAction.PERFORM;

    let finalAction = ScoreAction.HOLD;
    if (shouldBuy && !shouldSell) {
      finalAction = ScoreAction.BUY;
    } else if (shouldSell && !shouldBuy) {
      finalAction = ScoreAction.SELL;
    }

    return AutomatedDecision.create({
      time,
      price,
      finalAction,
      priceAction,
      highAction,
      lowAction,
    });
  }

  private static getScoreAction(
    value: Decimal,
    threshold: Threshold,
  ): EnablerAction {
    let result = EnablerAction.SKIP;

    if (value.gte(threshold.min) && value.lte(threshold.max))
      return EnablerAction.SKIP;
    if (value.lt(threshold.min)) result = EnablerAction.PERFORM;
    else if (value.gt(threshold.max)) result = EnablerAction.PERFORM;

    return result;
  }

  /**
   * Enabler - perform actions when stabilize
   *
   * - return 1 when value is between threshold
   * - return 0 otherwise
   */
  private static getEnablerAction(
    value: Decimal,
    threshold: Threshold,
  ): EnablerAction {
    return Number(value.gte(threshold.min) && value.lte(threshold.max));
  }
}

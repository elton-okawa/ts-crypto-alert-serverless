import { CryptoKline } from '@src/infra/crypto';
import { Entity } from '../core';

export class Decision extends Entity {
  public time: Date;
  public price: number;
  public finalAction: number;
  public priceAction: ActionInfo;
  public highAction: ActionInfo;
  public lowAction: ActionInfo;

  public constructor(params: Partial<Decision>) {
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
      action: Decision.getScoreAction(kline.priceScore, thresholds.price),
    };
    const highAction = {
      value: kline.highScore,
      action: Decision.getEnablerAction(kline.highScore, thresholds.high),
    };
    const lowAction = {
      value: kline.lowScore,
      action: Decision.getEnablerAction(kline.lowScore, thresholds.low),
    };

    const time = kline.closeTime;
    const price = kline.closePrice;
    const finalAction =
      priceAction.action * highAction.action * lowAction.action;

    return Decision.create({
      time,
      price,
      finalAction,
      priceAction,
      highAction,
      lowAction,
    });
  }

  private static getScoreAction(
    value: number,
    threshold: Threshold,
  ): ScoreAction {
    let result = ScoreAction.HOLD;

    if (value >= threshold.min && value <= threshold.max)
      return ScoreAction.HOLD;
    if (value < threshold.min) result = ScoreAction.BUY;
    else if (value > threshold.max) result = ScoreAction.SELL;

    return result;
  }

  /**
   * Enabler - perform actions when stabilize
   *
   * - return 1 when value is between threshold
   * - return 0 otherwise
   */
  private static getEnablerAction(
    value: number,
    threshold: Threshold,
  ): EnablerAction {
    return Number(value >= threshold.min && value <= threshold.max);
  }
}

export type ActionInfo = {
  value: number;
  action: ScoreAction | EnablerAction;
};

export enum ScoreAction {
  HOLD = 0,
  SELL = -1,
  BUY = 1,
}

export enum EnablerAction {
  PERFORM = 1,
  SKIP = 0,
}

export type Threshold = {
  min: number;
  max: number;
};

export type ThresholdConfig = Record<Field, Threshold>;

export type Field = 'price' | 'high' | 'low';

import { CryptoKline } from '@src/domain';
import {
  Field,
  Threshold,
  Decision,
  DecisionName,
  ThresholdConfig,
  DecisionAction,
} from './types';

export class DecisionResult {
  private _decisions: Record<Field, Decision>;
  private _time: Date;
  private _price: number;

  public static get csvHeader(): string {
    return [
      'Time',
      'Price',
      'Price Score',
      'Price Score Decision',
      'Low Score',
      'Low Score Decision',
      'High Score',
      'High Score Decision',
      'Final Decision',
    ].join(',');
  }

  public constructor(kline: CryptoKline, thresholds: ThresholdConfig) {
    this._decisions = {
      price: {
        value: kline.priceScore,
        decision: this.getScoreResult(
          kline.priceScore,
          thresholds.price,
          thresholds.price.invert,
        ),
      },
      high: {
        value: kline.highScore,
        decision: this.getEnablerDecision(kline.highScore, thresholds.high),
      },
      low: {
        value: kline.lowScore,
        decision: this.getEnablerDecision(kline.lowScore, thresholds.low),
      },
    };

    this._time = kline.closeTime;
    this._price = kline.closePrice;
  }

  public toCsvRow(): string {
    return [
      this._time.toISOString(),
      this._price,
      this._decisions.price.value,
      this.scoreToDecision(this._decisions.price.decision),
      ...['low', 'high'].flatMap((field: Field) => {
        const decision = this._decisions[field];

        return [decision.value, this.enablerToAction(decision.decision)];
      }),
      this.getFinalDecision(),
    ].join(',');
  }

  private getFinalDecision(): DecisionName {
    const finalScore =
      this._decisions.price.decision *
      this._decisions.high.decision *
      this._decisions.low.decision;

    return this.scoreToDecision(finalScore);
  }

  private getScoreResult(value: number, threshold: Threshold, invert = false) {
    let result = 0;

    if (value >= threshold.min && value <= threshold.max) return 0;
    if (value < threshold.min) result = -1;
    else if (value > threshold.max) result = 1;

    return result * (invert ? -1 : 1);
  }

  /**
   * Enabler - perform actions when stabilize
   *
   * - return 1 when value is between threshold
   * - return 0 otherwise
   */
  private getEnablerDecision(value: number, threshold: Threshold) {
    return Number(value >= threshold.min && value <= threshold.max);
  }

  private scoreToDecision(score: number): DecisionName {
    let decision = DecisionName.HOLD;
    if (score > 0) {
      decision = DecisionName.BUY;
    } else if (score < 0) {
      decision = DecisionName.SELL;
    }

    return decision;
  }

  private enablerToAction(slope: number): DecisionAction {
    if (slope === 1) return DecisionAction.PERFORM;
    else return DecisionAction.SKIP;
  }
}

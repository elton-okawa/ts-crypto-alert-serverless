import { CryptoKline } from '@src/domain';
import {
  Field,
  Parameter,
  Threshold,
  Decision,
  DecisionName,
  Point,
  ThresholdConfig,
  DecisionAction,
} from './types';

export class DecisionResult {
  private _decisions: Record<Field, Record<Parameter, Decision>>;
  private _time: Date;
  private _price: number;

  public static get csvHeader(): string {
    return [
      'Time',
      'Price',
      'Price Score',
      'Price Score Decision',
      'Price Slope',
      'Price Slope Decision',
      'Low Score',
      'Low Score Decision',
      'Low Slope',
      'Low Slope Decision',
      'High Score',
      'High Score Decision',
      'High Slope',
      'High Slope Decision',
      'Final Decision',
    ].join(',');
  }

  public constructor(klines: CryptoKline[], thresholds: ThresholdConfig) {
    const startKPoint = klines[0];
    const endKPoint = klines[klines.length - 1];

    this._decisions = ['price', 'high', 'low'].reduce<
      Record<Field, Record<Parameter, Decision>>
    >((data, field: Field) => {
      const fieldThreshold = thresholds[field];
      data[field] = {
        score: this.getScoreDecision(
          field,
          endKPoint,
          fieldThreshold.score,
          fieldThreshold.invert,
        ),
        slope: this.getSlopeDecision(
          field,
          startKPoint,
          endKPoint,
          klines.length,
          fieldThreshold.slope,
        ),
      };

      return data;
    }, {} as any);

    this._time = endKPoint.closeTime;
    this._price = endKPoint.closePrice;
  }

  public toCsvRow(): string {
    return [
      this._time.toISOString(),
      this._price,
      ...['price', 'low', 'high'].flatMap((field) => {
        const decision = this._decisions[field];

        return [
          decision.score.value,
          this.scoreToDecision(decision.score.decision),
          decision.slope.value,
          this.slopeToPerform(decision.slope.decision),
        ];
      }),
      this.getFinalDecision(),
    ].join(',');
  }

  private getFinalDecision(): DecisionName {
    const finalScore =
      this._decisions.price.score.decision *
        this._decisions.price.slope.decision +
      this._decisions.high.score.decision *
        this._decisions.high.slope.decision +
      this._decisions.low.score.decision * this._decisions.low.slope.decision;

    return this.scoreToDecision(finalScore);
  }

  private getSlopeDecision(
    field: Field,
    startKPoint: CryptoKline,
    endKPoint: CryptoKline,
    length: number,
    threshold: Threshold,
  ): Decision {
    const klineField = `${field}Score`;

    const slope = this.getSlope(
      { x: 0, y: startKPoint[klineField] },
      { x: length, y: endKPoint[klineField] },
    );

    return {
      value: slope,
      decision: this.getSlopeResult(slope, threshold),
    };
  }

  private getScoreDecision(
    field: Field,
    kline: CryptoKline,
    threshold: Threshold,
    invert: boolean,
  ): Decision {
    const klineField = `${field}Score`;

    const score = kline[klineField];

    return {
      value: score,
      decision: this.getScoreResult(score, threshold, invert),
    };
  }

  private getSlope(p1: Point, p2: Point): number {
    return (p2.y - p1.y) / p2.x;
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
   * - return 1 when slope value is between threshold
   * - return 0 otherwise
   */
  private getSlopeResult(value: number, threshold: Threshold) {
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

  private slopeToPerform(slope: number): DecisionAction {
    if (slope === 1) return DecisionAction.PERFORM;
    else return DecisionAction.SKIP;
  }
}

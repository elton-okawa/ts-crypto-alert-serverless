import { AutomatedDecision } from './automated-decision.entity';
import { Field, ActionType, ActionEnabler } from './types';

export class CsvDecisionResult {
  constructor(private _decision: AutomatedDecision) {}

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

  public toCsvRow(): string {
    return [
      this._decision.time.toISOString(),
      this._decision.price,
      this._decision.priceAction.value,
      this.enablerActionToString(this._decision.priceAction.action),
      ...['low', 'high'].flatMap((field: Field) => {
        const decision = this._decision[`${field}Action`];

        return [decision.value, this.enablerActionToString(decision.action)];
      }),
      this.scoreActionToString(this._decision.finalAction),
    ].join(',');
  }

  private scoreActionToString(score: number): ActionType {
    let decision = ActionType.HOLD;
    if (score > 0) {
      decision = ActionType.BUY;
    } else if (score < 0) {
      decision = ActionType.SELL;
    }

    return decision;
  }

  private enablerActionToString(slope: number): ActionEnabler {
    if (slope === 1) return ActionEnabler.PERFORM;
    else return ActionEnabler.SKIP;
  }
}

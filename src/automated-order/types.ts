import Decimal from 'decimal.js';

export type ActionInfo = {
  value: Decimal;
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

export enum ActionType {
  HOLD = 'HOLD',
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum ActionEnabler {
  PERFORM = 'PERFORM',
  SKIP = 'SKIP',
}

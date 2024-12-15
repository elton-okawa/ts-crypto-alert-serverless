export type Decision = {
  value: number;
  decision: number;
};

export enum DecisionName {
  HOLD = 'HOLD',
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum DecisionAction {
  PERFORM = 'PERFORM',
  SKIP = 'SKIP',
}

export type Field = 'price' | 'high' | 'low';
export type Parameter = 'slope' | 'score';

export type Threshold = {
  min: number;
  max: number;
};

export type ThresholdConfig = Record<Field, FieldThreshold>;

export type FieldThreshold = Threshold & {
  invert?: boolean;
};

export type Point = {
  x: number;
  y: number;
};

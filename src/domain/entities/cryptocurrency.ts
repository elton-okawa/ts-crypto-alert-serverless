import { Entity } from '@src/domain/core';

export class Cryptocurrency extends Entity {
  static readonly TABLE = 'cryptocurrency';

  name: string;
  symbol: string;
  historicalData: boolean | null;
  updatedAt: Date | null;

  constructor(params: Partial<Cryptocurrency>) {
    super(params);

    this.name = params.name;
    this.symbol = params.symbol;
    this.historicalData = params.historicalData ?? null;
    this.updatedAt = params.updatedAt ?? null;
  }
}

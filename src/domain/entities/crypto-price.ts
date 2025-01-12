import { Entity } from '@src/domain/core';
import { dollar } from '@src/lib';

export class CryptoPrice extends Entity {
  static readonly TABLE = 'price';

  symbol: string;
  pair: string;
  price: number;
  createdAt: Date;

  constructor(params: Partial<CryptoPrice>) {
    super(params);

    this.symbol = params.symbol;
    this.pair = params.pair;
    this.price = params.price;
    this.createdAt = params.createdAt ?? new Date();
  }

  difference(other: CryptoPrice): number {
    return this.price - other.price;
  }

  percentageDifference(other: CryptoPrice): number {
    return this.price / other.price;
  }

  format(): string {
    return dollar(this.price);
  }
}

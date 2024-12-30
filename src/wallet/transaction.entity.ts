import { Entity } from '@src/domain/core';
import Decimal from 'decimal.js';
import { TransactionType } from './types';

type TransactionParams = Entity & {
  type: TransactionType;
  code: string;
  date: Date;
  usdBalance: Decimal.Value;
  cryptoBalance: Decimal.Value;
  amount: Decimal.Value;
  price: Decimal.Value;
  gainOrLoss: Decimal.Value;
};

export class Transaction extends Entity {
  public static TABLE = 'transactions';
  type: TransactionType;
  code: string;
  date: Date;
  usdBalance: Decimal;
  cryptoBalance: Decimal;
  amount: Decimal;
  price: Decimal;
  gainOrLoss: Decimal;

  constructor(params: Partial<TransactionParams>) {
    super(params);

    this.type = params.type;
    this.code = params.code;
    this.date = params.date ?? new Date();
    this.usdBalance = new Decimal(params.usdBalance);
    this.cryptoBalance = new Decimal(params.cryptoBalance);
    this.amount = new Decimal(params.amount);
    this.price = new Decimal(params.price);
    this.gainOrLoss = new Decimal(params.gainOrLoss);
  }
}

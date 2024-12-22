import { Entity } from '@src/domain/core';
import Decimal from 'decimal.js';

type TransactionParams = Entity & {
  code: string;
  balance: Decimal.Value;
  amount: Decimal.Value;
  date: Date;
};

export class Transaction extends Entity {
  public static TABLE = 'transactions';
  code: string;
  balance: Decimal;
  amount: Decimal;
  date: Date;

  constructor(params: Partial<TransactionParams>) {
    super(params);

    this.code = params.code;
    this.balance = new Decimal(params.balance);
    this.amount = new Decimal(params.amount);
    this.date = params.date ?? new Date();
  }
}

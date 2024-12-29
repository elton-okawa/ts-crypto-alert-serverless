import { Entity } from '@src/domain/core';
import Decimal from 'decimal.js';
import { TransactionType } from './types';

type TransactionParams = Entity & {
  code: string;
  usdtBalance: Decimal.Value;
  cryptoBalance: Decimal.Value;
  amount: Decimal.Value;
  price: Decimal.Value;
  date: Date;
  type: TransactionType;
};

export class Transaction extends Entity {
  public static TABLE = 'transactions';
  code: string;
  usdtBalance: Decimal;
  cryptoBalance: Decimal;
  amount: Decimal;
  price: Decimal;
  date: Date;
  type: TransactionType;

  constructor(params: Partial<TransactionParams>) {
    super(params);

    this.code = params.code;
    this.usdtBalance = new Decimal(params.usdtBalance);
    this.cryptoBalance = new Decimal(params.cryptoBalance);
    this.amount = new Decimal(params.amount);
    this.price = new Decimal(params.price);
    this.date = params.date ?? new Date();
    this.type = params.type;
  }
}

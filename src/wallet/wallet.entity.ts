import { Entity } from '@src/domain/core';
import Decimal from 'decimal.js';
import { Transaction } from './transaction.entity';

type WalletParams = Entity & {
  code: string;
  amount: Decimal.Value;
  meanPrice: Decimal.Value;
  transactions: Transaction[];
};

export class Wallet extends Entity {
  public static TABLE = 'wallet';
  public code: string;
  public amount: Decimal;
  public meanPrice: Decimal;
  public transactions: Transaction[];

  constructor(params: Partial<WalletParams>) {
    super(params);

    this.code = params.code;
    this.amount = new Decimal(params.amount ?? 0);
    this.meanPrice = new Decimal(params.meanPrice ?? 0);
    this.transactions = params.transactions ?? [];
  }

  withdraw(amount: Decimal.Value) {
    // TODO validate

    const transaction = Transaction.create({
      code: this.code,
      amount: new Decimal(amount),
      balance: this.amount,
    });
    const totalPrice = this.meanPrice.times(this.amount);
    const withdrawPrice = this.meanPrice.times(amount);
    const updatedAmount = this.amount.sub(amount);

    this.meanPrice = updatedAmount.isZero()
      ? new Decimal(0)
      : totalPrice.sub(withdrawPrice).div(updatedAmount);
    this.amount = updatedAmount;

    this.transactions.push(transaction);
  }

  deposit(amount: Decimal.Value) {
    // TODO validate

    const transaction = Transaction.create({
      code: this.code,
      amount: new Decimal(amount),
      balance: this.amount,
    });

    const totalPrice = this.meanPrice.times(this.amount);
    const depositPrice = this.meanPrice.times(amount);
    const updatedAmount = this.amount.add(amount);

    this.meanPrice = totalPrice.add(depositPrice).div(updatedAmount);
    this.amount = updatedAmount;

    this.transactions.push(transaction);
  }
}

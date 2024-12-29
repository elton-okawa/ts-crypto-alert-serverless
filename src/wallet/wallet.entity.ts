import { Entity } from '@src/domain/core';
import Decimal from 'decimal.js';
import { Transaction } from './transaction.entity';
import { TransactionType } from './types';

type WalletParams = Entity & {
  code: string;
  usdBalance: Decimal.Value;
  cryptoBalance: Decimal.Value;
  meanPrice: Decimal.Value;
  transactions: Transaction[];
};

export class Wallet extends Entity {
  public static TABLE = 'wallet';
  public code: string;
  public usdBalance: Decimal;
  public cryptoBalance: Decimal;
  public meanPrice: Decimal;
  public transactions: Transaction[];

  get hasUsdBalance() {
    return this.usdBalance.gt(0);
  }

  get hasCryptoBalance() {
    return this.cryptoBalance.gt(0);
  }

  constructor(params: Partial<WalletParams>) {
    super(params);

    this.code = params.code;
    this.usdBalance = new Decimal(params.usdBalance ?? 0);
    this.cryptoBalance = new Decimal(params.cryptoBalance ?? 0);
    this.meanPrice = new Decimal(params.meanPrice ?? 0);
    this.transactions = params.transactions ?? [];
  }

  canWithdraw(amount: Decimal) {
    return this.cryptoBalance.gte(amount);
  }

  withdraw(amount: Decimal) {
    if (!this.canWithdraw(amount)) {
      throw new Error(
        `Cannot withdraw "${amount}", current balance "${this.cryptoBalance}"`,
      );
    }

    const transaction = Transaction.create({
      code: this.code,
      amount: new Decimal(amount),
      price: this.meanPrice,
      usdtBalance: this.usdBalance,
      cryptoBalance: this.cryptoBalance,
      type: TransactionType.WITHDRAW,
    });
    const totalPrice = this.meanPrice.times(this.cryptoBalance);
    const withdrawPrice = this.meanPrice.times(amount);
    const updatedAmount = this.cryptoBalance.sub(amount);

    this.meanPrice = updatedAmount.isZero()
      ? new Decimal(0)
      : totalPrice.sub(withdrawPrice).div(updatedAmount);
    this.usdBalance = this.usdBalance.plus(withdrawPrice);
    this.cryptoBalance = updatedAmount;

    this.transactions.push(transaction);
  }

  canDeposit(usdAmount: Decimal) {
    return this.usdBalance.gte(usdAmount);
  }

  deposit(price: Decimal, usdAmount: Decimal) {
    if (!this.canDeposit(usdAmount)) {
      throw new Error(
        `Cannot deposit "$${usdAmount}" worth of "${this.code}", current balance "${this.usdBalance}"`,
      );
    }

    const cryptoAmount = usdAmount.div(price);

    const transaction = Transaction.create({
      code: this.code,
      amount: cryptoAmount,
      price,
      usdtBalance: this.usdBalance,
      cryptoBalance: this.cryptoBalance,
      type: TransactionType.DEPOSIT,
    });

    const totalPrice = this.meanPrice.times(this.cryptoBalance);
    const updatedAmount = this.cryptoBalance.add(cryptoAmount);

    this.meanPrice = totalPrice.add(usdAmount).div(updatedAmount);
    this.usdBalance = this.usdBalance.sub(usdAmount);
    this.cryptoBalance = updatedAmount;

    this.transactions.push(transaction);
  }
}

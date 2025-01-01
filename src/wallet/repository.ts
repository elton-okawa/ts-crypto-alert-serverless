import { DatabaseService } from '@src/infra/database';
import { Logger } from '@src/logger';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';

export class WalletRepository {
  private readonly _logger = new Logger(WalletRepository.name);

  constructor(private _database: DatabaseService) {}

  public async getWallet(code: string): Promise<Wallet> {
    const result = await this._database.db
      .collection(Wallet.TABLE)
      .findOne({ code });
    if (!result) return null;

    return Wallet.create(result);
  }

  public async saveWallet(wallet: Wallet): Promise<Wallet> {
    const { _id, transactions, ...data } = JSON.parse(JSON.stringify(wallet));

    await Promise.all([
      this._database.db
        .collection(Wallet.TABLE)
        .updateOne({ _id }, { $set: data }, { upsert: true }),
      ...transactions.map((transaction) => this.saveTransaction(transaction)),
    ]);

    return wallet;
  }

  private saveTransaction(transaction: Transaction) {
    const { _id, ...data } = JSON.parse(JSON.stringify(transaction));

    return this._database.db
      .collection(Transaction.TABLE)
      .updateOne({ _id }, { $set: data }, { upsert: true });
  }
}

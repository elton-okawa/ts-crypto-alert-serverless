import { IUseCase } from '@src/domain';
import { Wallet } from './wallet.entity';
import { WalletRepository } from './repository';

type Params = {
  code: string;
};

export class GetWalletUseCase implements IUseCase<Params, Wallet> {
  constructor(private _repository: WalletRepository) {}

  execute(params: Params): Promise<Wallet> {
    return this._repository.getWallet(params.code);
  }
}

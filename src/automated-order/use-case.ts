import { ICryptoAPI, IUseCase } from '@src/domain';
import { Logger } from '@src/logger';
import { AutomatedDecision } from './automated-decision.entity';
import { AutomatedOrderRepository } from './repository';
import { Wallet, WalletRepository } from '@src/wallet';

export class AutomatedOrderUseCase implements IUseCase<void, void> {
  private readonly logger = new Logger(AutomatedOrderUseCase.name);

  constructor(
    private _api: ICryptoAPI,
    private _repository: AutomatedOrderRepository,
    private _walletRepository: WalletRepository,
  ) {}
  async execute(): Promise<void> {
    this.logger.log('Starting use case...');

    const code = 'BTC';
    const pair = 'USDT';
    const symbol = `${code}${pair}`;

    const [config, savedWallet] = await Promise.all([
      this._repository.getConfig(code),
      this._walletRepository.getWallet(code),
    ]);
    const wallet = savedWallet ? savedWallet : Wallet.create({ code });
    const [kline] = await this._api.getKLines({
      symbol,
      interval: config.interval,
      limit: 1,
    });

    const decision = AutomatedDecision.createFrom(kline, config.thresholds);
    decision.buy
      ? wallet.deposit(wallet.amount)
      : wallet.withdraw(wallet.amount);

    await Promise.all([
      this._repository.saveDecision(decision),
      this._walletRepository.saveWallet(wallet),
    ]);

    this.logger.log('Finished use case!');
  }
}

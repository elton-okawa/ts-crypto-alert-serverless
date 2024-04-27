import {
  ICryptoRepository,
  CryptoPrice,
  ICryptoAPI,
  IUseCase,
} from '@src/domain';
import { Logger } from '@src/logger';

export class UpdatePricesUseCase implements IUseCase<void, CryptoPrice[]> {
  private readonly logger = new Logger(UpdatePricesUseCase.name);

  constructor(
    private repository: ICryptoRepository,
    private api: ICryptoAPI,
  ) {}

  async execute(): Promise<CryptoPrice[]> {
    this.logger.log('Updating prices...');

    const symbols = await this.repository.listSymbols();
    this.logger.log(`Symbols: [${symbols}]`);

    const prices = await this.api.getPrices({
      symbols,
      tokenPair: 'USDC',
    });

    await this.repository.savePrices(prices);
    this.logger.log('Prices updated successfully!');

    return prices;
  }
}

import {
  ICryptoRepository,
  CryptoPrice,
  ICryptoAPI,
  IUseCase,
} from '@src/domain';
import { Logger } from '@src/logger';

export class UpdateHistoricalPricesUseCase implements IUseCase<void, void> {
  private readonly logger = new Logger(UpdateHistoricalPricesUseCase.name);

  constructor(
    private repository: ICryptoRepository,
    private api: ICryptoAPI,
  ) {}

  async execute(): Promise<void> {
    this.logger.log(`Updating historical prices...`);

    const cryptocurrencies = await this.repository.listNewCryptocurrencies();
    if (cryptocurrencies.length === 0) {
      this.logger.log(`There is historical price to update`);
      return;
    }

    for (const crypto of cryptocurrencies) {
      await this.paginatedUpdateHistoricalPrice(crypto.symbol);
    }

    cryptocurrencies.map((crypto) => {
      crypto.historicalData = true;
      crypto.updatedAt = new Date();
    });
    await this.repository.saveCryptocurrencies(cryptocurrencies);

    this.logger.log('Historical prices updated successfully!');
  }

  private async paginatedUpdateHistoricalPrice(symbol: string): Promise<void> {
    let startTime = 0;
    let results: CryptoPrice[] = [];

    while (results.length > 0 || startTime === 0) {
      this.logger.debug(
        `[${symbol}] Historical data from: ${new Date(startTime).toISOString()}...`,
      );
      results = await this.api.getHistoricalPrice({
        symbol: symbol,
        tokenPair: 'USDT',
        startTime,
      });
      this.logger.debug(`[${symbol}] Found: ${results.length}...`);

      if (!results.length) break;

      await this.repository.savePrices(results);

      // shift start time to avoid same record
      startTime = results[results.length - 1].createdAt.getTime() + 1;
    }
  }
}

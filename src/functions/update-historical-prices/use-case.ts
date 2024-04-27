import {
  ICryptoRepository,
  CryptoPrice,
  ICryptoAPI,
  IUseCase,
} from '@src/domain';
import { Logger } from '@src/logger';

export class UpdateHistoricalPricesUseCase
  implements IUseCase<void, CryptoPrice[]>
{
  private readonly logger = new Logger(UpdateHistoricalPricesUseCase.name);

  constructor(
    private repository: ICryptoRepository,
    private api: ICryptoAPI,
  ) {}

  async execute(): Promise<CryptoPrice[]> {
    this.logger.log(`Updating historical prices...`);

    const cryptocurrencies = await this.repository.listNewCryptocurrencies();
    if (cryptocurrencies.length === 0) {
      this.logger.log(`There is historical price to update`);
      return;
    }

    const prices = (
      await Promise.all(
        cryptocurrencies.map((crypto) =>
          this.api.getHistoricalPrice({
            symbol: crypto.symbol,
            tokenPair: 'USDC',
          }),
        ),
      )
    ).flat();

    await this.repository.savePrices(prices);

    cryptocurrencies.map((crypto) => {
      crypto.historicalData = true;
      crypto.updatedAt = new Date();
    });
    await this.repository.saveCryptocurrencies(cryptocurrencies);

    this.logger.log('Historical prices updated successfully!');
    return prices;
  }
}

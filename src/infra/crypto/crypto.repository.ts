import { DatabaseService } from '@src/infra/database';
import {
  Alert,
  CryptoPrice,
  Cryptocurrency,
  ICryptoRepository,
  MeanPriceResult,
} from '@src/domain';
import { Logger } from '@src/logger';

export class CryptoRepository implements ICryptoRepository {
  private readonly logger = new Logger(CryptoRepository.name);

  constructor(private database: DatabaseService) {}

  async listAlerts(): Promise<Alert[]> {
    this.logger.log(`Listing alerts...`);

    const result = await this.database.db
      .collection(Alert.TABLE)
      .find()
      .toArray();

    this.logger.log(`Found '${result.length}' alerts`);
    return Alert.createMany(result);
  }

  async mostRecentPrice(
    symbol: string,
    startingFrom: Date,
  ): Promise<CryptoPrice> {
    this.logger.log(
      `Fetching most recent price for '${symbol}' starting from '${startingFrom.toISOString()}'...`,
    );

    const [result] = await this.database.db
      .collection<CryptoPrice>(CryptoPrice.TABLE)
      .find({ createdAt: { $lt: startingFrom } })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (!result) {
      throw new Error(
        `Most recent price not found starting from '${startingFrom.toISOString()}' for '${symbol}'`,
      );
    }

    this.logger.log(
      `Most recent price starting from '${startingFrom.toISOString()}' for '${symbol}' is '${result.price}'`,
    );
    return CryptoPrice.create(result);
  }

  async listSymbols(): Promise<string[]> {
    this.logger.log('Fetching symbols...');
    const cryptocurrencies = await this.database.db
      .collection<Cryptocurrency>(Cryptocurrency.TABLE)
      .find()
      .toArray();

    const symbols = cryptocurrencies.map((crypto) => crypto.symbol);
    this.logger.log(`Found: [${symbols}]`);

    return symbols;
  }

  async savePrices(prices: CryptoPrice[]): Promise<void> {
    this.logger.log(`Saving '${prices.length}' prices`);
    await this.database.db
      .collection<CryptoPrice>(CryptoPrice.TABLE)
      .insertMany(prices);
    this.logger.log('Prices saved successfully');
  }

  async meanPrice(
    symbol: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<MeanPriceResult> {
    this.logger.log(
      `Calculating mean price for '${symbol}' starting from '${fromDate.toISOString()}' to '${toDate.toISOString()}'`,
    );

    const [result] = await this.database.db
      .collection(CryptoPrice.TABLE)
      .aggregate<MeanPriceResult>([
        {
          $match: {
            symbol: symbol,
            createdAt: { $gte: fromDate, $lt: toDate },
          },
        },
        {
          $group: {
            _id: '$symbol',
            symbol: { $first: '$symbol' },
            mean: {
              $avg: '$price',
            },
            total: { $sum: '$price' },
            count: { $count: {} },
          },
        },
      ])
      .toArray();

    if (!result) {
      throw new Error(
        `Symbol '${symbol}' without any value from '${fromDate.toISOString()}' to '${toDate.toISOString()}'`,
      );
    }

    this.logger.log(`Mean hourly price for '${symbol}' is '${result.mean}'`);
    return result;
  }
}

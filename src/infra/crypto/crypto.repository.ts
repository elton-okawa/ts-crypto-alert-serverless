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
  ): Promise<CryptoPrice | null> {
    this.logger.log(
      `Fetching most recent price for '${symbol}' starting from '${startingFrom.toISOString()}'...`,
    );

    const [result] = await this.database.db
      .collection<CryptoPrice>(CryptoPrice.TABLE)
      .find({ symbol, createdAt: { $lt: startingFrom } })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (!result) {
      this.logger.warn(
        `Most recent price not found starting from '${startingFrom.toISOString()}' for '${symbol}'`,
      );
      return null;
    }

    this.logger.log(
      `Most recent price starting from '${startingFrom.toISOString()}' for '${symbol}' is '${result.price}'`,
    );
    return CryptoPrice.create(result);
  }

  async listSymbols(): Promise<string[]> {
    this.logger.debug('Listing symbols...');

    const cryptocurrencies = await this.database.db
      .collection<Cryptocurrency>(Cryptocurrency.TABLE)
      .find()
      .toArray();
    const symbols = cryptocurrencies.map((crypto) => crypto.symbol);

    this.logger.debug(`Found symbols: [${symbols}]`);
    return symbols;
  }

  async listCryptocurrencies(): Promise<Cryptocurrency[]> {
    this.logger.debug('Listing cryptocurrencies...');

    const cryptocurrencies = await this.database.db
      .collection<Cryptocurrency>(Cryptocurrency.TABLE)
      .find()
      .toArray();

    this.logger.debug(
      `Found cryptocurrencies: [${cryptocurrencies.map((crypto) => crypto.symbol)}]`,
    );
    return Cryptocurrency.createMany(cryptocurrencies);
  }

  async listNewCryptocurrencies(): Promise<Cryptocurrency[]> {
    this.logger.debug(`Fetching new cryptocurrencies...`);

    const cryptocurrencies = (
      await this.database.db
        .collection<Cryptocurrency>(Cryptocurrency.TABLE)
        .find({ historicalData: { $ne: true } })
        .toArray()
    ).map((c) => Cryptocurrency.create(c));

    this.logger.debug(
      `Found new cryptocurrencies: [${cryptocurrencies.map((c) => c.symbol)}]`,
    );

    return cryptocurrencies;
  }

  async savePrices(prices: CryptoPrice[]): Promise<void> {
    this.logger.log(`Saving '${prices.length}' prices`);
    await this.database.db.collection<CryptoPrice>(CryptoPrice.TABLE).bulkWrite(
      prices.map((price) => {
        const { _id, ...data } = price;

        return {
          updateOne: {
            filter: {
              symbol: price.symbol,
              createdAt: price.createdAt,
            },
            update: { $set: data },
            upsert: true,
          },
        };
      }),
    );
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

  async saveCryptocurrencies(cryptocurrencies: Cryptocurrency[]) {
    this.logger.debug(`Saving ${cryptocurrencies.length} cryptocurrencies...`);

    await this.database.db.collection(Cryptocurrency.TABLE).bulkWrite(
      cryptocurrencies.map(
        (crypto) => ({
          replaceOne: { filter: { _id: crypto.id }, replacement: crypto },
        }),
        { ordered: false },
      ),
    );

    this.logger.debug('Cryptocurrencies saved successfully!');
  }

  async cryptocurrenciesUpdated(symbols: string[]) {
    this.logger.debug(`Setting updatedAt of [${symbols}] cryptocurrencies...`);

    await this.database.db
      .collection<Cryptocurrency>(Cryptocurrency.TABLE)
      .updateMany(
        { symbol: { $in: symbols } },
        { $set: { updatedAt: new Date() } },
      );

    this.logger.debug(`UpdatedAt set successfully!`);
  }

  async getDailyPrices(symbol: string, options: { limit: number }) {
    this.logger.debug(
      `Getting last ${options.limit} daily prices of "${symbol}"...`,
    );

    const results = await this.database.db
      .collection(CryptoPrice.TABLE)
      .aggregate<MeanPriceResult>([
        {
          $match: {
            symbol: symbol,
          },
        },
        {
          $addFields: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
        },
        {
          $group: {
            _id: '$date',
            symbol: { $first: '$symbol' },
            price: { $first: '$price' },
            pair: { $first: '$pair' },
            createdAt: { $first: '$createdAt' },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: options.limit,
        },
      ])
      .toArray();

    this.logger.debug(`Daily prices got successfully!`);

    return CryptoPrice.createMany(results);
  }
}

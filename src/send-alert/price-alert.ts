import {
  Cryptocurrency,
  CryptoPrice,
  ICryptoRepository,
  IUseCase,
  PriceAlert,
  PriceNotification,
} from '@src/domain';
import { Logger } from '@src/logger';
import { MAX_STREAK } from './constants';

export type PriceAlertUseCaseParams = {
  cryptocurrency: Cryptocurrency;
  config: PriceAlert;
};

export class PriceAlertUseCase
  implements IUseCase<PriceAlertUseCaseParams, PriceNotification | null>
{
  private readonly logger = new Logger(PriceAlertUseCase.name);

  constructor(private repository: ICryptoRepository) {}

  async execute({
    cryptocurrency,
    config,
  }: PriceAlertUseCaseParams): Promise<PriceNotification | null> {
    const lastPrice = await this.repository.mostRecentPrice(
      cryptocurrency.symbol,
      new Date(),
    );
    if (!lastPrice) {
      this.logger.error(
        `Current price not found for "${cryptocurrency.symbol}"`,
      );
      return null;
    }

    this.logger.log(
      `'${cryptocurrency.symbol}' last price '${lastPrice.price}'`,
    );

    const dailyPrices = await this.repository.getDailyPrices(
      cryptocurrency.symbol,
      { limit: MAX_STREAK },
    );

    const notification = this.getNotification(
      config,
      cryptocurrency,
      lastPrice,
      dailyPrices,
    );

    this.logger.log(
      `${notification ? 'Calculated' : 'No'} notification for '${cryptocurrency.symbol}'`,
    );

    return notification;
  }

  async getNotification(
    config: PriceAlert,
    cryptocurrency: Cryptocurrency,
    mostRecentPrice: CryptoPrice,
    cryptoPrices: CryptoPrice[],
  ): Promise<PriceNotification> {
    this.logger.debug(
      `Getting price notification for '${cryptocurrency.symbol}'...`,
    );

    let streak = 0;
    for (const crypto of cryptoPrices) {
      if (!config.triggered(crypto.price)) {
        break;
      }

      streak++;
    }

    const notification = PriceNotification.create({
      triggered: config.triggered(mostRecentPrice.price),
      decision: config.decision(mostRecentPrice.price),
      cooldown: false, // TODO implement cooldown
      symbol: cryptocurrency.symbol,
      price: mostRecentPrice.price,
      min: config.min,
      max: config.max,
      streak,
    });
    this.logger.debug(
      `'${cryptocurrency.symbol}' - (triggered: '${notification.triggered}', cooldown: '${notification.cooldown}')`,
    );

    return notification;
  }
}

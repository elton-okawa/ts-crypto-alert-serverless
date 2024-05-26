import {
  ICryptoRepository,
  PercentageNotification,
  PeriodHelper,
  IPercentageAlertUseCase,
  PercentageAlert,
  Cryptocurrency,
  CryptoPrice,
  PercentageAlertUseCaseParams,
} from '@src/domain';
import { Logger } from '@src/logger';

export class PercentageAlertUseCase implements IPercentageAlertUseCase {
  private readonly logger = new Logger(PercentageAlertUseCase.name);

  constructor(private readonly repository: ICryptoRepository) {}

  async execute({
    cryptocurrency,
    configs,
  }: PercentageAlertUseCaseParams): Promise<PercentageNotification[]> {
    const lastPrice = await this.repository.mostRecentPrice(
      cryptocurrency.symbol,
      new Date(),
    );
    if (!lastPrice) {
      this.logger.error(
        `Current price not found for "${cryptocurrency.symbol}"`,
      );
      return [];
    }

    this.logger.log(
      `'${cryptocurrency.symbol}' last price '${lastPrice.price}'`,
    );

    const notificationOrNull = await Promise.all(
      configs.map((config) =>
        this.getNotification(config, cryptocurrency, lastPrice),
      ),
    );

    const notifications = notificationOrNull.filter((value) => !!value);
    this.logger.log(
      `Calculated '${notifications.length}' notifications for '${cryptocurrency.symbol}'`,
    );

    return notifications;
  }

  async getNotification(
    config: PercentageAlert,
    cryptocurrency: Cryptocurrency,
    lastPrice: CryptoPrice,
  ): Promise<PercentageNotification | null> {
    this.logger.debug(
      `Getting notification for '${cryptocurrency.symbol}' in '${config.period}'...`,
    );

    if (!cryptocurrency.canPercentageAlert(config.period, config.cooldown)) {
      this.logger.debug(
        `Notification for '${cryptocurrency.symbol}' '${config.period}' in cooldown!`,
      );
      return null;
    }

    const lastPeriodPrice = await this.repository.mostRecentPrice(
      cryptocurrency.symbol,
      PeriodHelper.getDate(config.period, lastPrice.createdAt),
    );
    if (!lastPeriodPrice) {
      this.logger.warn(
        `'${cryptocurrency.symbol}' price for period '${config.period}' not found, skipping`,
      );
      return null;
    }

    this.logger.log(
      `'${cryptocurrency.symbol}' price '${lastPrice.price}' for '${config.period}'`,
    );

    const percentageDiff = lastPrice.percentageDifference(lastPeriodPrice);
    if (config.triggered(percentageDiff)) {
      this.logger.debug(
        `Notification for '${cryptocurrency.symbol}' '${config.period}' triggered!`,
      );

      return PercentageNotification.create({
        symbol: cryptocurrency.symbol,
        currentPrice: lastPrice,
        targetPrice: lastPeriodPrice,
        period: config.period,
        difference: percentageDiff,
      });
    }

    this.logger.debug(
      `Notification for '${cryptocurrency.symbol}' '${config.period}' not triggered!`,
    );
    return null;
  }
}

import {
  ICryptoRepository,
  PercentageAlert,
  PercentageNotification,
  PeriodHelper,
  IPercentageAlertUseCase,
} from '@src/domain';
import { Logger } from '@src/logger';

export type Params = {
  symbol: string;
  configs: PercentageAlert[];
};

export class PercentageAlertUseCase implements IPercentageAlertUseCase {
  private readonly logger = new Logger(PercentageAlertUseCase.name);

  constructor(private readonly repository: ICryptoRepository) {}

  async execute({
    symbol,
    configs,
  }: Params): Promise<PercentageNotification[]> {
    const lastPrice = await this.repository.mostRecentPrice(symbol, new Date());
    this.logger.log(`'${symbol}' last price '${lastPrice.price}'`);

    const notificationOrNull = await Promise.all(
      configs.map(async (config) => {
        const lastPeriodPrice = await this.repository.mostRecentPrice(
          symbol,
          PeriodHelper.getDate(config.period, lastPrice.createdAt),
        );
        this.logger.log(
          `'${symbol}' price '${lastPrice.price}' for '${config.period}'`,
        );

        const percentageDiff = lastPrice.percentageDifference(lastPeriodPrice);
        if (config.triggered(percentageDiff)) {
          return PercentageNotification.create({
            symbol,
            currentPrice: lastPrice,
            targetPrice: lastPeriodPrice,
            period: config.period,
            difference: percentageDiff,
          });
        }

        return null;
      }),
    );

    const notifications = notificationOrNull.filter((value) => !!value);
    this.logger.log(
      `Calculated '${notifications.length}' notifications for '${symbol}'`,
    );

    return notifications;
  }
}

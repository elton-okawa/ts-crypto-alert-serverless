import { toMap } from '@src/lib';
import {
  Alert,
  PercentageAlert,
  ICryptoRepository,
  PercentageNotification,
  Notification,
  Period,
  IUseCase,
  INotifier,
} from '@src/domain';
import { Logger } from '@src/logger';

export class SendAlertUseCase implements IUseCase<void, void> {
  private readonly logger = new Logger(SendAlertUseCase.name);

  constructor(
    private repository: ICryptoRepository,
    private notifier: INotifier,
  ) {}

  async execute(): Promise<void> {
    const [symbols, alertConfigs] = await Promise.all([
      this.repository.listSymbols(),
      this.repository.listAlerts(),
    ]);

    const alertConfigMap = toMap(alertConfigs, 'symbol');
    const percentageNotifications = (
      await Promise.all(
        symbols.map(async (symbol) => {
          const alert = this.alertFor(symbol, alertConfigMap);
          const percentageNotifications = await this.calculatePercentageAlert(
            symbol,
            alert.percentages,
          );

          return percentageNotifications;
        }),
      )
    ).flat();

    await this.notifier.send(
      Notification.create({ percentages: percentageNotifications }),
    );
  }

  private alertFor(symbol: string, alertMap: Record<string, Alert>): Alert {
    const specific = alertMap[symbol] ?? {};

    return Alert.create({
      ...alertMap['default'],
      ...specific,
      id: null,
    });
  }

  private async calculatePercentageAlert(
    symbol: string,
    configs: PercentageAlert[],
  ): Promise<PercentageNotification[]> {
    const lastPrice = await this.repository.mostRecentPrice(symbol, new Date());
    this.logger.log(`'${symbol}' last price '${lastPrice.price}'`);

    const notificationOrNull = await Promise.all(
      configs.map(async (config) => {
        const lastPeriodPrice = await this.repository.mostRecentPrice(
          symbol,
          Period.getDate(config.period, lastPrice.createdAt),
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

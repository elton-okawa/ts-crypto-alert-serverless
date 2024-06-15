import { toMap } from '@src/lib';
import {
  Alert,
  ICryptoRepository,
  Notification,
  IUseCase,
  INotifier,
  IPercentageAlertUseCase,
  Cryptocurrency,
} from '@src/domain';
import { Logger } from '@src/logger';

export class SendAlertUseCase implements IUseCase<void, void> {
  private readonly logger = new Logger(SendAlertUseCase.name);

  constructor(
    private repository: ICryptoRepository,
    private notifier: INotifier,
    private percentageAlert: IPercentageAlertUseCase,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Starting use case...');

    const [cryptocurrencies, alertConfigs] = await Promise.all([
      this.repository.listCryptocurrencies(),
      this.repository.listAlerts(),
    ]);

    const alertConfigMap = toMap(alertConfigs, 'symbol');
    const percentageNotifications = await this.calculatePercentageNotifications(
      cryptocurrencies,
      alertConfigMap,
    );

    await this.repository.saveCryptocurrencies(cryptocurrencies);

    const notification = Notification.create({
      percentages: percentageNotifications,
    });
    if (!notification.hasNotifications()) {
      this.logger.log('There is no notifications to send');
      return;
    }

    await this.notifier.send(notification);

    this.logger.log('Finished use case!');
  }

  private alertFor(symbol: string, alertMap: Record<string, Alert>): Alert {
    return alertMap[symbol] ?? alertMap['default'];
  }

  private async calculatePercentageNotifications(
    cryptocurrencies: Cryptocurrency[],
    alertConfigMap: Record<string, Alert>,
  ) {
    return (
      await Promise.all(
        cryptocurrencies.map(async (crypto) => {
          const alert = this.alertFor(crypto.symbol, alertConfigMap);
          const percentageNotifications = await this.percentageAlert.execute({
            cryptocurrency: crypto,
            configs: alert.percentages,
          });

          percentageNotifications.forEach((percentage) =>
            crypto.percentageAlertSent(percentage.period),
          );

          return percentageNotifications;
        }),
      )
    ).flat();
  }
}

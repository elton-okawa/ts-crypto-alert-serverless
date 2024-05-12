import { toMap } from '@src/lib';
import {
  Alert,
  ICryptoRepository,
  Notification,
  IUseCase,
  INotifier,
  IPercentageAlertUseCase,
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
    const [cryptocurrencies, alertConfigs] = await Promise.all([
      this.repository.listCryptocurrencies(),
      this.repository.listAlerts(),
    ]);

    const alertConfigMap = toMap(alertConfigs, 'symbol');
    const percentageNotifications = (
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

    await this.repository.saveCryptocurrencies(cryptocurrencies);

    await this.notifier.send(
      Notification.create({ percentages: percentageNotifications }),
    );
  }

  private alertFor(symbol: string, alertMap: Record<string, Alert>): Alert {
    return alertMap[symbol] ?? alertMap['default'];
  }
}

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
    const [symbols, alertConfigs] = await Promise.all([
      this.repository.listSymbols(),
      this.repository.listAlerts(),
    ]);

    const alertConfigMap = toMap(alertConfigs, 'symbol');
    const percentageNotifications = (
      await Promise.all(
        symbols.map(async (symbol) => {
          const alert = this.alertFor(symbol, alertConfigMap);
          const percentageNotifications = await this.percentageAlert.execute({
            symbol,
            configs: alert.percentages,
          });

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
}

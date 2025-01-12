import { toMap } from '@src/lib';
import {
  Alert,
  ICryptoRepository,
  Notification,
  IUseCase,
  INotifier,
  IPercentageAlertUseCase,
  Cryptocurrency,
  PercentageAlert,
  PriceAlert,
} from '@src/domain';
import { Logger } from '@src/logger';
import { merge } from 'lodash';
import { PriceAlertUseCase } from './price-alert';

export class SendAlertUseCase implements IUseCase<void, void> {
  private readonly logger = new Logger(SendAlertUseCase.name);

  constructor(
    private repository: ICryptoRepository,
    private notifiers: INotifier[],
    private percentageAlert: IPercentageAlertUseCase,
    private priceAlert: PriceAlertUseCase,
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
    const priceNotifications = await this.calculatePriceNotifications(
      cryptocurrencies,
      alertConfigMap,
    );

    await this.repository.saveCryptocurrencies(cryptocurrencies);

    const notification = Notification.create({
      percentages: percentageNotifications,
      prices: priceNotifications,
    });

    // Always send for now
    // if (!notification.hasTriggeredNotifications()) {
    //   this.logger.log('There is no notifications to send');
    //   return;
    // }

    await Promise.all(
      this.notifiers.map((notifier) => notifier.send(notification)),
    );

    this.logger.log('Finished use case!');
  }

  private alertFor(
    symbol: string,
    alertMap: Record<string, Alert>,
  ): { percentages: PercentageAlert[]; price: PriceAlert } {
    const def = alertMap['default'];
    const specific = alertMap[symbol];

    if (!specific) {
      return {
        percentages: def.percentages,
        price: def.price,
      };
    }

    const data = {
      percentages: PercentageAlert.createMany(
        specific.percentages.length > 0
          ? specific.percentages
          : def.percentages,
      ),
      price: PriceAlert.create(merge({}, def.price, specific.price ?? {})),
    };

    return data;
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

  private async calculatePriceNotifications(
    cryptocurrencies: Cryptocurrency[],
    alertConfigMap: Record<string, Alert>,
  ) {
    return (
      await Promise.all(
        cryptocurrencies.map(async (crypto) => {
          const alert = this.alertFor(crypto.symbol, alertConfigMap);
          const priceNotification = await this.priceAlert.execute({
            cryptocurrency: crypto,
            config: alert.price,
          });

          return priceNotification;
        }),
      )
    ).filter((nt) => !!nt);
  }
}

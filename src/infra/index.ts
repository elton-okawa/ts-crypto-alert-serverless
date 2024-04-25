import { IConnectable } from '@src/domain';
import { binanceApi } from './binance';
import { databaseService } from './database';
import { discordNotifier, discordService } from './discord';

export { cryptoRepository } from './crypto';
export const cryptoApi = binanceApi;
export const notifier = discordNotifier;

const connectable: IConnectable[] = [databaseService, discordService];

export const bootstrap = () =>
  Promise.all(connectable.map((service) => service.connect()));

export const teardown = () =>
  Promise.all(connectable.map((service) => service.disconnect()));

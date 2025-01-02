import { IConnectable } from '@src/domain';
import { binanceApi } from './binance';
import { databaseService } from './database';
import { discordNotifier, discordService } from './discord';
import { sendgridNotifier } from './sendgrid';

export { cryptoRepository } from './crypto';
export const cryptoApi = binanceApi;
export const notifiers = [discordNotifier, sendgridNotifier];

const connectable: IConnectable[] = [databaseService, discordService];

export const bootstrap = () =>
  Promise.all(connectable.map((service) => service.connect()));

export const teardown = () =>
  Promise.all(connectable.map((service) => service.disconnect()));

import { IConnectable } from '@src/domain';
import { binanceApi } from './binance';
import { databaseService } from './database';
import { discordService } from './discord';

export { discordNotifier } from './discord';
export { sendgridNotifierFactory } from './sendgrid';

export { cryptoRepository } from './crypto';
export const cryptoApi = binanceApi;

const connectable: IConnectable[] = [databaseService, discordService];

export const bootstrap = () =>
  Promise.all(connectable.map((service) => service.connect()));

export const teardown = () =>
  Promise.all(connectable.map((service) => service.disconnect()));

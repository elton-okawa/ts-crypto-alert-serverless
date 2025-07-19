import { HttpFunction } from '@google-cloud/functions-framework';
import { SendAlertUseCase } from './use-case';
import {
  cryptoRepository,
  discordNotifier,
  mailjetNotifierFactory,
} from '@src/infra';
import { handlerTemplateFactory } from '@src/lib';
import { PercentageAlertUseCase } from './percentage-alert';
import { EmailAlertFormatter } from './email-alert.formatter';
import { PriceAlertUseCase } from './price-alert';

const percentageAlert = new PercentageAlertUseCase(cryptoRepository);
const priceAlert = new PriceAlertUseCase(cryptoRepository);
const useCase = new SendAlertUseCase(
  cryptoRepository,
  [discordNotifier, mailjetNotifierFactory(new EmailAlertFormatter())],
  percentageAlert,
  priceAlert,
);

const handler: HttpFunction = async (_req, res) => {
  await useCase.execute();
  res.sendStatus(200);
};

export default handlerTemplateFactory(handler);

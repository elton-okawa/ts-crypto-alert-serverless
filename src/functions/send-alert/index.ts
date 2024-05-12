import { HttpFunction } from '@google-cloud/functions-framework';
import { SendAlertUseCase } from './use-case';
import { cryptoRepository, notifier } from '@src/infra';
import { handlerTemplateFactory } from '@src/lib';
import { PercentageAlertUseCase } from './percentage-alert';

const percentageAlert = new PercentageAlertUseCase(cryptoRepository);
const useCase = new SendAlertUseCase(
  cryptoRepository,
  notifier,
  percentageAlert,
);

const handler: HttpFunction = async (_req, res) => {
  await useCase.execute();
  res.sendStatus(200);
};

export default handlerTemplateFactory(handler);

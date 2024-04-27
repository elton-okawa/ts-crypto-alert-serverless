import { HttpFunction } from '@google-cloud/functions-framework';
import { SendAlertUseCase } from './use-case';
import { cryptoRepository, notifier } from '@src/infra';
import { handlerTemplateFactory } from '@src/lib';

const useCase = new SendAlertUseCase(cryptoRepository, notifier);

const handler: HttpFunction = async (_req, res) => {
  await useCase.execute();
  res.sendStatus(200);
};

export default handlerTemplateFactory(handler);

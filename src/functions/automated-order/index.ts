import { HttpFunction } from '@google-cloud/functions-framework';
import { AutomatedOrderUseCase } from './use-case';
import { cryptoApi } from '@src/infra';
import { handlerTemplateFactory } from '@src/lib';

const useCase = new AutomatedOrderUseCase(cryptoApi);

const handler: HttpFunction = async (_req, res) => {
  await useCase.execute();
  res.sendStatus(200);
};

export default handlerTemplateFactory(handler);

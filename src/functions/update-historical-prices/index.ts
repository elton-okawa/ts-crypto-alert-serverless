import { HttpFunction } from '@google-cloud/functions-framework';
import { UpdateHistoricalPricesUseCase } from './use-case';
import { cryptoApi, cryptoRepository } from '@src/infra';
import { handlerTemplateFactory } from '@src/lib';

const useCase = new UpdateHistoricalPricesUseCase(cryptoRepository, cryptoApi);

const handler: HttpFunction = async (_req, res) => {
  await useCase.execute();
  res.sendStatus(200);
};

export default handlerTemplateFactory(handler);

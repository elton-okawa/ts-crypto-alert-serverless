import { HttpFunction } from '@google-cloud/functions-framework';
import { handlerTemplateFactory } from '@src/lib';
import { UpdatePricesUseCase } from './use-case';
import { cryptoApi, cryptoRepository } from '@src/infra';

const useCase = new UpdatePricesUseCase(cryptoRepository, cryptoApi);

const handler: HttpFunction = async (_req, res) => {
  await useCase.execute();
  res.sendStatus(200);
};

export default handlerTemplateFactory(handler);

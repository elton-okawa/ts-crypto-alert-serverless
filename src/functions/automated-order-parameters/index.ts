import { HttpFunction } from '@google-cloud/functions-framework';
import { AutomatedOrderParametersUseCase } from './use-case';
import { cryptoApi } from '@src/infra';
import { handlerTemplateFactory } from '@src/lib';

const useCase = new AutomatedOrderParametersUseCase(cryptoApi);

const handler: HttpFunction = async (req, res) => {
  await useCase.execute(req.body);
  res.sendStatus(200);
};

export default handlerTemplateFactory(handler);

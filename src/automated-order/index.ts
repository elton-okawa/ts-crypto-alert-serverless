import { HttpFunction } from '@google-cloud/functions-framework';
import { AutomatedOrderUseCase } from './use-case';
import { cryptoApi } from '@src/infra';
import { handlerTemplateFactory } from '@src/lib';
import { databaseService } from '@src/infra/database';
import { WalletRepository } from '@src/wallet';
import { AutomatedOrderRepository } from './repository';
import { AutomatedOrderParametersUseCase } from './parameters.use-case';

export * from './automated-decision.entity';
export * from './automated-order-config.entity';
export * from './crypto-kline.vo';

const automatedOrderRepository = new AutomatedOrderRepository(databaseService);
const walletRepository = new WalletRepository(databaseService);

const useCase = new AutomatedOrderUseCase(
  cryptoApi,
  automatedOrderRepository,
  walletRepository,
);

const automatedOrderHandler: HttpFunction = async (_req, res) => {
  await useCase.execute();
  res.sendStatus(200);
};

export const automatedOrderFunction = handlerTemplateFactory(
  automatedOrderHandler,
);

const paramsUseCase = new AutomatedOrderParametersUseCase(cryptoApi);
const automatedOrderParams: HttpFunction = async (req, res) => {
  await paramsUseCase.execute(req.body);
  res.sendStatus(200);
};
export const automatedOrderParamsFunction =
  handlerTemplateFactory(automatedOrderParams);

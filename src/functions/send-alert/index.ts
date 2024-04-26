import { HttpFunction } from '@google-cloud/functions-framework';
import { SendAlertUseCase } from './use-case';
import { cryptoRepository, notifier, bootstrap, teardown } from '@src/infra';

const useCase = new SendAlertUseCase(cryptoRepository, notifier);

const handler: HttpFunction = async (_req, res) => {
  await bootstrap();
  await useCase.execute();
  await teardown();

  res.sendStatus(200);
};

export default handler;

import { HttpFunction } from '@google-cloud/functions-framework';
import { bootstrap, teardown } from '@src/infra';

export function handlerTemplateFactory(handler: HttpFunction): HttpFunction {
  return async (req, res) => {
    await bootstrap();
    await handler(req, res);
    await teardown();
  };
}

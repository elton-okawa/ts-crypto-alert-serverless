import 'dotenv/config';

import * as framework from '@google-cloud/functions-framework';
import { HttpFunction } from '@google-cloud/functions-framework';
import { Logger } from './logger';
import functions from './functions';

const logger = new Logger('Root');

function setupProduction() {
  logger.log('Loading production...');

  Object.entries(functions).forEach(([name, handler]) => {
    logger.log(`Adding "${name}"`);
    framework.http(name, handler);
  });

  logger.log('Production loaded successfully!');
}

function setupLocal() {
  logger.log('Loading local...');

  for (const [name] of Object.entries(functions)) {
    logger.log(`Providing at "/${name}"`);
  }

  const indexHandler: HttpFunction = (req, res) => {
    const name = req.path.slice(1);
    if (name in functions) {
      return functions[name](req, res);
    } else {
      const message = `function "${name}" not defined`;
      logger.error(message);
      res.send(message);
    }
  };

  framework.http('index', indexHandler);

  logger.log('Local loaded successfully');
}

if (process.env.NODE_ENV === 'local') {
  setupLocal();
} else {
  setupProduction();
}

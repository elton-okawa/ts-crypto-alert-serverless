import * as framework from '@google-cloud/functions-framework';
import * as path from 'path';
import * as fs from 'fs';
import { HttpFunction } from '@google-cloud/functions-framework';
import { Logger } from './logger';
import functions from './functions';

const logger = new Logger('Root');

async function loadFunctions(): Promise<Record<string, HttpFunction>> {
  const functionsPath = path.join(__dirname, 'functions');
  const functionDir = fs.readdirSync(path.join(__dirname, 'functions'));

  const functions = await Promise.all(
    functionDir.map(async (dir) => {
      const handler = await import(path.join(functionsPath, dir));
      return [dir, handler];
    }),
  );

  return Object.fromEntries(functions);
}

function setupProduction() {
  logger.log('Loading production...');

  Object.entries(functions).forEach(([name, handler]) =>
    framework.http(name, handler),
  );

  logger.log('Production loaded successfully!');
}

function setupLocal() {
  logger.log('Loading local...');

  const indexHandler: HttpFunction = (req, res) => {
    if (req.path in functions) {
      return functions[req.path](req, res);
    } else {
      res.send('function not defined');
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

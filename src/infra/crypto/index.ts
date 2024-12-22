import { ICryptoRepository } from '@src/domain';
import { CryptoRepository } from './crypto.repository';
import { databaseService } from '../database';

export * from './crypto.repository';

export const cryptoRepository: ICryptoRepository = new CryptoRepository(
  databaseService,
);

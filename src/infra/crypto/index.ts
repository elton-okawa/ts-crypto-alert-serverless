import { ICryptoRepository } from '@src/domain';
import { CryptoRepository } from './crypto.repository';
import { databaseService } from '../database';

export * from './crypto.repository';
export * from '../../domain/entities/crypto-kline.vo';

export const cryptoRepository: ICryptoRepository = new CryptoRepository(
  databaseService,
);

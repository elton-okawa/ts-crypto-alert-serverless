import { ICryptoAPI } from '@src/domain';
import { BinanceAPI } from './binance.api';
import { binanceApiConfig } from './binance.config';

export type { BinanceAPI } from './binance.api';

export const binanceApi: ICryptoAPI = new BinanceAPI(binanceApiConfig);

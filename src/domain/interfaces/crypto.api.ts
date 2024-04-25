import { CryptoPrice } from '../crypto-price';

export interface ICryptoAPI {
  getPrices(params: GetPricesParams): Promise<CryptoPrice[]>;
  getHistoricalPrice(params: GetHistoricalPriceParams): Promise<CryptoPrice[]>;
}

export type GetPricesParams = {
  symbols: string[];
  tokenPair: string;
};

export type GetHistoricalPriceParams = {
  symbol: string;
  tokenPair: string;
};

export const ICryptoAPI = Symbol('ICryptoAPI');

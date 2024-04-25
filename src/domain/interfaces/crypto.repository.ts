import { CryptoPrice } from '../crypto-price';
import { Alert } from '../alert';

export interface ICryptoRepository {
  listSymbols(): Promise<string[]>;
  savePrices(prices: CryptoPrice[]): Promise<void>;
  listAlerts(): Promise<Alert[]>;
  meanPrice(
    symbol: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<MeanPriceResult>;
  mostRecentPrice(symbol: string, startingFrom: Date): Promise<CryptoPrice>;
}

export type MeanPriceResult = {
  symbol: string;
  mean: number;
  total: number;
  count: number;
};

export const ICryptoRepository = Symbol('ICryptoRepository');

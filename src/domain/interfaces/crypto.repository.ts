import { Cryptocurrency, Alert, CryptoPrice } from '@src/domain/entities';

export interface ICryptoRepository {
  listSymbols(): Promise<string[]>;
  listCryptocurrencies(): Promise<Cryptocurrency[]>;
  listNewCryptocurrencies(): Promise<Cryptocurrency[]>;
  savePrices(prices: CryptoPrice[]): Promise<void>;
  listAlerts(): Promise<Alert[]>;
  meanPrice(
    symbol: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<MeanPriceResult>;
  mostRecentPrice(symbol: string, startingFrom: Date): Promise<CryptoPrice>;
  saveCryptocurrencies(cryptocurrencies: Cryptocurrency[]): Promise<void>;
  cryptocurrenciesUpdated(symbols: string[]): Promise<void>;
}

export type MeanPriceResult = {
  symbol: string;
  mean: number;
  total: number;
  count: number;
};

export const ICryptoRepository = Symbol('ICryptoRepository');

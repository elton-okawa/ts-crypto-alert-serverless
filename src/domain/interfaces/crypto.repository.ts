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
  mostRecentPrice(
    symbol: string,
    startingFrom: Date,
  ): Promise<CryptoPrice | null>;
  saveCryptocurrencies(cryptocurrencies: Cryptocurrency[]): Promise<void>;
  cryptocurrenciesUpdated(symbols: string[]): Promise<void>;
  getDailyPrices(
    symbol: string,
    options: { limit: number },
  ): Promise<CryptoPrice[]>;
}

export type MeanPriceResult = {
  symbol: string;
  mean: number;
  total: number;
  count: number;
};

export const ICryptoRepository = Symbol('ICryptoRepository');

import { CryptoPrice, CryptoKline } from '@src/domain/entities';

export interface ICryptoAPI {
  getPrices(params: GetPricesParams): Promise<CryptoPrice[]>;
  getHistoricalPrice(params: GetHistoricalPriceParams): Promise<CryptoPrice[]>;
  getKLines(params: GetKlineParams): Promise<CryptoKline[]>;
}

export type GetPricesParams = {
  symbols: string[];
  tokenPair: string;
};

export type GetHistoricalPriceParams = {
  symbol: string;
  tokenPair: string;
};

export type GetKlineParams = {
  symbol: string;
  interval: Interval;
  limit?: number;
};

export enum Interval {
  OneSecond = '1s',
  OneMinute = '1m',
  ThreeMinutes = '3m',
  FiveMinutes = '5m',
  FifteenMinutes = '15m',
  ThirtyMinutes = '30m',
  OneHour = '1h',
  TwoHours = '2h',
  FourHours = '4h',
  SixHours = '6h',
  EightHours = '8h',
  TwelveHours = '12h',
  OneDay = '1d',
  ThreeDays = '3d',
  OneWeek = '1w',
  OneMonth = '1M',
}

export const ICryptoAPI = Symbol('ICryptoAPI');

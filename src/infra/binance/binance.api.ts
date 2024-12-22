import {
  CryptoPrice,
  GetHistoricalPriceParams,
  GetKlineParams,
  GetPricesParams,
  ICryptoAPI,
} from '@src/domain';
import { BinanceApiConfig } from './binance.config';
import { Logger } from '@src/logger';

import axios from 'axios';
import { CryptoKline } from '@src/automated-order/crypto-kline.vo';

export class BinanceAPI implements ICryptoAPI {
  private readonly logger = new Logger(BinanceAPI.name);

  constructor(private config: BinanceApiConfig) {}

  async getKLines(params: GetKlineParams): Promise<CryptoKline[]> {
    this.logger.log('Fetching klines...');

    const { data } = await axios.get<Kline[]>(this.url('/api/v3/klines'), {
      params,
    });

    const result = data.map((d) => {
      return CryptoKline.create({
        openTime: new Date(d[0]),
        openPrice: d[1],
        highPrice: d[2],
        lowPrice: d[3],
        closePrice: d[4],
        volume: d[5],
        closeTime: new Date(d[6]),
        quoteAssetVolume: d[7],
        trades: d[8],
        takerBuyBase: d[9],
        takerBuyQuote: d[10],
      });
    });

    this.logger.log('Klines fetched successfully');

    return result;
  }

  private url(endpoint: string) {
    return `${this.config.url}${endpoint}`;
  }

  async getPrices({
    symbols,
    tokenPair,
  }: GetPricesParams): Promise<CryptoPrice[]> {
    this.logger.log('Fetching prices...');

    const fullSymbols = symbols.map((s) => `${s}${tokenPair}`);

    const { data } = await axios.get<TickerPrice[]>(
      this.url('/api/v3/ticker/price'),
      {
        params: { symbols: JSON.stringify(fullSymbols) },
      },
    );

    const result = data.map((ticker) =>
      CryptoPrice.create({
        symbol: ticker.symbol.replace(tokenPair, ''),
        pair: tokenPair,
        price: parseFloat(ticker.price),
      }),
    );

    this.logger.log('Prices fetched successfully');

    return result;
  }

  async getHistoricalPrice({
    symbol,
    tokenPair,
  }: GetHistoricalPriceParams): Promise<CryptoPrice[]> {
    this.logger.log(`Fetching historical price for "${symbol}"...`);

    const fullSymbol = `${symbol}${tokenPair}`;

    const { data } = await axios.get<Kline[] & { code: number }>(
      this.url('/api/v3/uiKlines'),
      {
        params: {
          symbol: fullSymbol,
          interval: '1w',
          startTime: '0',
        },
      },
    );
    if (data?.code === -1121) {
      this.logger.error(
        `Historical price for full symbol "${fullSymbol}" not found. Check binance US restrictions`,
      );
      return [];
    }

    const result = data.map((kline) =>
      CryptoPrice.create({
        symbol,
        pair: tokenPair,
        price: parseFloat(kline[1]),
        createdAt: new Date(kline[0]),
      }),
    );

    this.logger.log(`Fetched "${result.length}" prices for "${symbol}"`);
    return result;
  }
}

type TickerPrice = {
  symbol: string;
  price: string;
};

type Kline = [
  openTime: number,
  openPrice: string,
  highPrice: string,
  lowPrice: string,
  closePrice: string,
  volume: string,
  closeTime: number,
  quoteAssetVolume: string,
  numberOfTrades: number,
  takerBuyBaseAssetVolume: string,
  takerBuyQuoteAssetVolume: string,
  unused: string,
];

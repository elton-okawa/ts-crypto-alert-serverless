import {
  CryptoPrice,
  GetHistoricalPriceParams,
  GetPricesParams,
  ICryptoAPI,
} from '@src/domain';
import { BinanceApiConfig } from './binance.config';
import { Logger } from '@src/logger';

import axios from 'axios';

export class BinanceAPI implements ICryptoAPI {
  private readonly logger = new Logger(BinanceAPI.name);

  constructor(private config: BinanceApiConfig) {}

  url(endpoint: string) {
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

    const { data } = await axios.get<Kline[]>(this.url('/api/v3/uiKlines'), {
      params: {
        symbol: fullSymbol,
        interval: '1w',
        startTime: '0',
      },
    });

    console.log(data);

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

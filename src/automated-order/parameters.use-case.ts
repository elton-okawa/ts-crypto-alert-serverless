import { ICryptoAPI, Interval, IUseCase } from '@src/domain';
import { Logger } from '@src/logger';
import { writeFileSync } from 'fs';
import { CsvDecisionResult } from './csv-decision-result';
import { CryptoKline } from './crypto-kline.vo';
import { ThresholdConfig } from './types';
import { AutomatedDecision } from './automated-decision.entity';
import { Wallet } from '@src/wallet';

type Params = {
  thresholds: ThresholdConfig;
  window: number;
  symbol: string;
  amount: number; // max is 1k
  interval: Interval;
  wallet: {
    usdBalance: number;
    cryptoBalance: number;
    meanPrice: number;
  };
};

const CSV_SEPARATOR = ',';

export class AutomatedOrderParametersUseCase implements IUseCase<Params, void> {
  private readonly logger = new Logger(AutomatedOrderParametersUseCase.name);

  constructor(private api: ICryptoAPI) {}
  async execute(params: Params): Promise<void> {
    this.logger.log('Starting use case...');

    const wallet = Wallet.create({
      code: params.symbol,
      usdBalance: params.wallet.usdBalance,
      cryptoBalance: params.wallet.cryptoBalance,
      meanPrice: params.wallet.meanPrice,
    });

    const klines = await this.api.getKLines({
      symbol: params.symbol,
      interval: params.interval,
      limit: params.amount,
    });

    const results = klines.map((kline) => {
      const decision = AutomatedDecision.createFrom(kline, params.thresholds);
      if (decision.buy && wallet.usdBalance) {
        wallet.deposit(decision.price, wallet.usdBalance.div(2));
      } else if (decision.sell && wallet.hasCryptoBalance) {
        wallet.withdraw(wallet.cryptoBalance.div(2));
      }

      return new CsvDecisionResult(decision, {
        usdBalance: wallet.usdBalance,
        cryptoBalance: wallet.cryptoBalance,
      });
    });

    this.writeKlineFile(klines, './klines.csv');
    this.writeResultFile(results, './decisions.csv');

    this.logger.log('Finished use case!');
  }

  private writeKlineFile(klines: CryptoKline[], filename: string) {
    writeFileSync(
      filename,
      klines
        .map((kline) =>
          [
            kline.closeTime.toISOString(),
            kline.highPrice,
            kline.openPrice,
            kline.closePrice,
            kline.lowPrice,
          ].join(CSV_SEPARATOR),
        )
        .join('\n'),
    );
  }

  private writeResultFile(decisions: CsvDecisionResult[], filename: string) {
    writeFileSync(
      filename,
      [CsvDecisionResult.csvHeader, ...decisions.map((d) => d.toCsvRow())].join(
        '\n',
      ),
    );
  }
}

import { ICryptoAPI, Interval, IUseCase } from '@src/domain';
import { Logger } from '@src/logger';
import { writeFileSync } from 'fs';
import { CsvDecisionResult } from './csv-decision-result';
import { CryptoKline } from './crypto-kline.vo';
import { ThresholdConfig } from './types';
import { AutomatedDecision } from './automated-decision.entity';

type Params = {
  thresholds: ThresholdConfig;
  window: number;
  symbol: string;
  amount: number; // max is 1k
  interval: Interval;
};

const CSV_SEPARATOR = ',';

export class AutomatedOrderParametersUseCase implements IUseCase<Params, void> {
  private readonly logger = new Logger(AutomatedOrderParametersUseCase.name);

  constructor(private api: ICryptoAPI) {}
  async execute(params: Params): Promise<void> {
    this.logger.log('Starting use case...');

    const klines = await this.api.getKLines({
      symbol: params.symbol,
      interval: params.interval,
      limit: params.amount,
    });

    const results = klines.map((kline) => {
      const decision = AutomatedDecision.createFrom(kline, params.thresholds);
      return new CsvDecisionResult(decision);
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

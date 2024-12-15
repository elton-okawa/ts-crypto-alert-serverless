import { CryptoKline, ICryptoAPI, Interval, IUseCase } from '@src/domain';
import { Logger } from '@src/logger';
import { writeFileSync } from 'fs';
import { DecisionResult } from './decision-result';
import { ThresholdConfig } from './types';

type Params = {
  thresholds: ThresholdConfig;
  window: number;
  symbol: string;
};

const AMOUNT = 7 * 24;
const CSV_SEPARATOR = ',';

// TODO not sure about threshold min and max
// maybe calculate for each kline instead of aggregating results
export class AutomatedOrderParametersUseCase implements IUseCase<Params, void> {
  private readonly logger = new Logger(AutomatedOrderParametersUseCase.name);

  constructor(private api: ICryptoAPI) {}
  async execute(params: Params): Promise<void> {
    this.logger.log('Starting use case...');

    const klines = await this.api.getKLines({
      symbol: params.symbol,
      interval: Interval.OneHour,
      limit: AMOUNT, // max is 1k
    });

    const slidingWindow = this.getSlidingWindow(klines, params.window);
    const results = slidingWindow.map(
      (window) => new DecisionResult(window, params.thresholds),
    );

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

  private writeResultFile(decisions: DecisionResult[], filename: string) {
    writeFileSync(
      filename,
      [DecisionResult.csvHeader, ...decisions.map((d) => d.toCsvRow())].join(
        '\n',
      ),
    );
  }

  private getSlidingWindow(klines: CryptoKline[], size: number) {
    const window = [];
    const slidingWindow = [];
    for (const kline of klines) {
      window.push(kline);
      if (window.length === size - 1) {
        slidingWindow.push([...window]);
        window.splice(0, 1);
      }
    }

    return slidingWindow;
  }
}

import { CryptoKline, ICryptoAPI, Interval, IUseCase } from '@src/domain';
import { Logger } from '@src/logger';
import { writeFileSync } from 'fs';

type Params = {
  thresholds: {
    price: Threshold;
    low: Threshold;
    high: Threshold;
  };
  window: number;
  symbol: string;
};

type DecisionResult = {
  decision: Decision;
  time: Date;
  price: number;
  scores: {
    price: number;
    high: number;
    low: number;
  };
};

enum Decision {
  HOLD = 'HOLD',
  BUY = 'BUY',
  SELL = 'SELL',
}

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
      limit: 1000, // max is 1k
    });

    const slidingWindow = this.getSlidingWindow(klines, params.window);
    const results = slidingWindow.map((window) =>
      this.getDecision(window, params.window, params.thresholds),
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
          ].join(';'),
        )
        .join('\n'),
    );
  }

  private writeResultFile(decisions: DecisionResult[], filename: string) {
    writeFileSync(
      filename,
      [
        'Time;Price;Price Score;Low Score;High Score;Decision',
        ...decisions.map((res) =>
          [
            res.time.toISOString(),
            res.price,
            res.scores.price,
            res.scores.low,
            res.scores.high,
            res.decision,
          ].join(';'),
        ),
      ].join('\n'),
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

  private getDecision(
    klines: CryptoKline[],
    window: number,
    thresholds: { price: Threshold; high: Threshold; low: Threshold },
  ): DecisionResult {
    const scores = klines.reduce(
      (curr, kline, index) => {
        curr.price += kline.priceScore * Math.pow((index + 1) / window, 3);
        curr.high += kline.highPriceScore * Math.pow((index + 1) / window, 3);
        curr.low += kline.lowPriceScore * Math.pow((index + 1) / window, 3);

        return curr;
      },
      { price: 0, high: 0, low: 0 },
    );

    const finalScore =
      this.getScoreResult(scores.price, thresholds.price) +
      this.getScoreResult(scores.high, thresholds.high) +
      this.getScoreResult(scores.low, thresholds.low);

    let decision = Decision.HOLD;
    if (finalScore > 0) {
      decision = Decision.BUY;
    } else if (finalScore < 0) {
      decision = Decision.SELL;
    }

    const currentKline = klines[klines.length - 1];

    return {
      decision,
      scores,
      time: currentKline.closeTime,
      price: currentKline.closePrice,
    };
  }

  private getScoreResult(value: number, threshold: Threshold) {
    const abs = Math.abs(value);
    if (abs >= threshold.min && abs <= threshold.max) return 0;
    else if (abs < threshold.min) return -1;
    else return 1;
  }
}

type Threshold = {
  min: number;
  max: number;
};

import { ICryptoAPI, Interval, IUseCase } from '@src/domain';
import { Logger } from '@src/logger';

const AMOUNT_KLINES = 24 * 7;
const SCORE_THRESHOLD = 0.1;

export class AutomatedOrderUseCase implements IUseCase<void, void> {
  private readonly logger = new Logger(AutomatedOrderUseCase.name);

  constructor(private api: ICryptoAPI) {}
  async execute(): Promise<void> {
    this.logger.log('Starting use case...');

    const ticker = 'BTC';
    const pair = 'USDT';
    const symbol = `${ticker}${pair}`;

    const klines = await this.api.getKLines({
      symbol,
      interval: Interval.OneHour,
      limit: AMOUNT_KLINES,
    });

    const score = klines.reduce((curr, kline, index) => {
      const klineScore =
        kline.priceScore * 5 + kline.lowScore + kline.highScore;
      return curr + Math.pow(klineScore * ((index + 1) / AMOUNT_KLINES), 3);
    }, 0);

    let result = 'NO_ACTION';
    if (Math.abs(score) > SCORE_THRESHOLD) {
      result = score > 0 ? 'BUY' : 'SELL';
    }

    console.log(
      `Price: ${klines[AMOUNT_KLINES - 1].closePrice}, score: ${score}, ${result}`,
    );

    this.logger.log('Finished use case!');
  }
}

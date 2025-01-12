import {
  Decision,
  HistoricalPrice,
  INotificationFormatter,
  Notification,
  PercentageByCrypto,
  PercentageNotification,
  Period,
  PeriodHelper,
  PriceNotification,
} from '@src/domain';
import { StyledField, CryptoAlertTemplateData } from './types';
import Color from 'colorjs.io';
import { percentage, toMap } from '@src/lib';
import {
  BUY_START_COLOR,
  SELL_START_COLOR,
  BUY_END_COLOR,
  SELL_END_COLOR,
  MAX_STREAK,
  KEEP_COLOR,
  EMPHASIS_DIFF,
} from './constants';

const dateFormatter = new Intl.DateTimeFormat('pt-BR');

export class EmailAlertFormatter
  implements INotificationFormatter<CryptoAlertTemplateData>
{
  format(notification: Notification): CryptoAlertTemplateData {
    return {
      subject: `Crypto Alert - ${dateFormatter.format(new Date())}`,
      percentage: this.formatPercentages(notification.percentageByCrypto),
      price: this.formatPrices(notification.prices),
    };
  }

  private formatPercentages(
    percentages: PercentageByCrypto,
  ): CryptoAlertTemplateData['percentage'] {
    return Object.entries(percentages).map(([code, data]) => {
      return {
        code,
        yesterday: this.formatPercentage(data[Period.DAILY]),
        lastWeek: this.formatPercentage(data[Period.WEEKLY]),
        lastMonth: this.formatPercentage(data[Period.MONTHLY]),
        lastYear: this.formatPercentage(data[Period.YEARLY]),
        lastTwoYears: this.formatPercentage(data[Period.TWO_YEARS]),
      };
    });
  }

  private formatPrices(
    prices: PriceNotification[],
  ): CryptoAlertTemplateData['price'] {
    return prices.map((p) => {
      const history = p.history.map((entry) =>
        this.formatHistoricalPrice(p.price, entry),
      );

      const hasEmphasis = history.some((history) =>
        [history.min, history.max].some((v) => !!v.style),
      );

      return {
        color: this.interpolateColor(p.decision, p.streak, MAX_STREAK),
        code: p.symbol,
        value: {
          value: this.formatPrice(p.price),
          style: hasEmphasis ? EMPHASIS_DIFF.style : '',
        },
        decision: p.decision,
        streak: p.streak >= MAX_STREAK ? `${MAX_STREAK}+` : p.streak.toString(),
        history: toMap(history, 'period', (p) => PeriodHelper.getKey(p)),
      };
    });
  }

  private formatPrice(price: number) {
    return price > 100 ? price.toFixed(0) : price.toPrecision(2);
  }

  private formatHistoricalPrice(price: number, field: HistoricalPrice) {
    return {
      period: field.period,
      min: this.formatHistoryField(price, field.min, true),
      max: this.formatHistoryField(price, field.max),
    };
  }

  private formatHistoryField(price: number, target: number, isMin = false) {
    const percentageDiff = isMin
      ? (price - target) / target
      : (target - price) / price;
    let style = '';
    if (Math.abs(percentageDiff) <= EMPHASIS_DIFF.diff) {
      style = EMPHASIS_DIFF.style;
    }

    return {
      style,
      value: `${this.formatPrice(target)} ${percentage(percentageDiff, { decimalPlaces: 0, includeSignal: false })}`,
    };
  }

  private formatPercentage(data: PercentageNotification): StyledField {
    return {
      style: [`color:${this.getColor(data?.difference)}`].join('; '),
      value: percentage(data?.difference, { decimalPlaces: 0 }),
    };
  }

  private getColor(value: number | undefined) {
    const gray400 = '#9ca3af';
    const green500 = '#22c55e';
    const red500 = '#ef4444';

    // less than 1% show as gray
    if (!value || Math.floor(value * 100) === 0) {
      return gray400;
    }

    return value > 0 ? green500 : red500;
  }

  private interpolateColor(
    decision: Decision,
    streak: number,
    maxStreak: number,
  ) {
    if (decision === Decision.Keep) {
      return KEEP_COLOR;
    }

    const start = new Color(
      decision === Decision.Buy ? BUY_START_COLOR : SELL_START_COLOR,
    );
    const end = new Color(
      decision === Decision.Buy ? BUY_END_COLOR : SELL_END_COLOR,
    );
    const position = streak > maxStreak ? 1 : streak / maxStreak;

    const interpolate = start.range(end);
    return interpolate(position).to('srgb').toString({ format: 'hex' });
  }
}

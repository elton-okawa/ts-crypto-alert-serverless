import {
  Decision,
  INotificationFormatter,
  Notification,
  PercentageByCrypto,
  PercentageNotification,
  Period,
  PriceNotification,
} from '@src/domain';
import { ColoredField, CryptoAlertTemplateData } from './types';
import Color from 'colorjs.io';
import { percentage } from '@src/lib';
import {
  BUY_START_COLOR,
  SELL_START_COLOR,
  BUY_END_COLOR,
  SELL_END_COLOR,
  MAX_STREAK,
  KEEP_COLOR,
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
    return prices.map((p) => ({
      color: this.interpolateColor(p.decision, p.streak, MAX_STREAK),
      code: p.symbol,
      value: p.price.toPrecision(p.price > 0 ? 6 : 4),
      decision: p.decision,
      streak: p.streak >= MAX_STREAK ? `${MAX_STREAK}+` : p.streak.toString(),
    }));
  }

  private formatPercentage(data: PercentageNotification): ColoredField {
    return {
      color: this.getColor(data?.difference),
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

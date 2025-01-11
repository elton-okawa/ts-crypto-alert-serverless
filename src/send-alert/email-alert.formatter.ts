import {
  INotificationFormatter,
  Notification,
  PercentageByCrypto,
  PercentageNotification,
  Period,
} from '@src/domain';
import { ColoredField, CryptoAlertTemplateData, Decision } from './types';
import Color from 'colorjs.io';
import { percentage } from '@src/lib';

const BUY_START_COLOR = '#bbff99';
const BUY_END_COLOR = '#ecffe3';
const SELL_START_COLOR = '#ff9696';
const SELL_END_COLOR = '#ffd6d6';
const MAX_STREAK = 30;

const dateFormatter = new Intl.DateTimeFormat('pt-BR');

export class EmailAlertFormatter
  implements INotificationFormatter<CryptoAlertTemplateData>
{
  format(notification: Notification): CryptoAlertTemplateData {
    return {
      subject: `Crypto Alert - ${dateFormatter.format(new Date())}`,
      percentage: this.formatPercentages(notification.percentageByCrypto),
      price: [],
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
    const start = new Color(
      decision === 'B' ? BUY_START_COLOR : SELL_START_COLOR,
    );
    const end = new Color(decision === 'B' ? BUY_END_COLOR : SELL_END_COLOR);
    const position = streak > maxStreak ? 1 : streak / maxStreak;

    const interpolate = start.range(end);
    return interpolate(position).to('srgb').toString({ format: 'hex' });
  }
}

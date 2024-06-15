import {
  INotificationFormatter,
  Notification,
  PercentageNotification,
  Period,
} from '@src/domain';
import { Bold, percentage, Regular, toMapArray } from '@src/lib';

type FormatOptions = {
  colorize?: boolean;
};

export class DiscordByPeriodFormatter implements INotificationFormatter {
  format(notification: Notification): string {
    const percentages = notification.triggeredPercentages;
    return [
      ...this.percentages(percentages),

      // Colored part does not work in mobile and message has limit of 2k characters
      // '```ansi',
      // ...this.colorizePercentages(percentages),
      // '```',
    ].join('\n');
  }

  private percentages(percentages: PercentageNotification[]): string[] {
    if (percentages.length <= 0) return [];
    const grouped = toMapArray(percentages, 'period');

    return [
      'Percentage:',
      ...Object.keys(Period).flatMap((period) => {
        if (!(period in grouped)) return [];

        return [
          `  ${period}:`,
          ...grouped[period].map(
            (percentage) =>
              `    ${this.formatPercentage(percentage, { colorize: false })}`,
          ),
        ];
      }),
    ];
  }

  private colorizePercentages(percentages: PercentageNotification[]): string[] {
    if (percentages.length <= 0) return [];

    const grouped = toMapArray(percentages, 'period');

    return [
      `${Bold.Blue}=========== Percentage ===========`,
      ...Object.keys(Period).flatMap((period) => {
        if (!(period in grouped)) {
          return [];
        }

        return [
          `${Regular.Cyan}${period}:`,
          ...grouped[period].map((percentage) =>
            this.formatPercentage(percentage, { colorize: true }),
          ),
        ];
      }),
    ];
  }

  private formatPercentage(
    notification: PercentageNotification,
    options: FormatOptions = {},
  ): string {
    const color = this.getColor(notification.difference);
    return `${options.colorize ? color : ''}${percentage(notification.difference)} ${notification.symbol.padEnd(4)}: ${notification.targetPrice.format()} -> ${notification.currentPrice.format()}`;
  }

  private getColor(difference: number): string {
    return difference >= 0 ? Regular.Green : Regular.Red;
  }
}

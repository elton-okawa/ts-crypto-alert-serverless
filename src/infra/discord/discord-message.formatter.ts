import {
  INotificationFormatter,
  Notification,
  PercentageNotification,
  Period,
} from '@src/domain';
import { Bold, percentage, Regular } from '@src/lib';

export class DiscordMessageFormatter implements INotificationFormatter {
  format(notification: Notification): string {
    return [
      '```ansi',
      ...this.formatPercentages(notification.percentages),
      '```',
    ].join('\n');
  }

  private formatPercentages(percentages: PercentageNotification[]): string[] {
    if (percentages.length <= 0) return [];

    const grouped = percentages.reduce(
      (group, current) => {
        if (!(current.period in group)) {
          group[current.period] = [];
        }
        group[current.period].push(current);

        return group;
      },
      {} as Record<Period, PercentageNotification[]>,
    );

    return [
      `${Bold.Blue}=========== Percentage ===========`,
      ...Object.keys(Period).flatMap((period) => {
        if (!(period in grouped)) {
          return [];
        }

        return [
          `${Regular.Cyan}${period}:`,
          ...grouped[period].map((percentage) =>
            this.formatPercentage(percentage),
          ),
        ];
      }),
    ];
  }

  private formatPercentage(notification: PercentageNotification): string {
    const color = this.getColor(notification.difference);
    return `${color}${percentage(notification.difference)} ${notification.symbol.padEnd(4)}: ${notification.targetPrice.format()} -> ${notification.currentPrice.format()}`;
  }

  private getColor(difference: number): string {
    return difference >= 0 ? Regular.Green : Regular.Red;
  }
}

import {
  INotificationFormatter,
  Notification,
  PercentageNotification,
} from '@src/domain';
import { percentage, Regular } from '@src/lib';

export class DiscordMessageFormatter implements INotificationFormatter {
  format(notification: Notification): string {
    return [
      '```ansi',
      `${Regular.Blue}Percentage:`,
      ...notification.percentages.map(this.formatPercentage.bind(this)),
      '```',
    ].join('\n');
  }

  private formatPercentage(notification: PercentageNotification) {
    const color = this.getColor(notification.difference);
    return `${color}${percentage(notification.difference)} ${notification.symbol.padEnd(4)}: ${notification.targetPrice.format()} -> ${notification.currentPrice.format()}`;
  }

  private getColor(difference: number): string {
    return difference >= 0 ? Regular.Green : Regular.Red;
  }
}

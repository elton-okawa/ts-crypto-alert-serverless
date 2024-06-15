import {
  INotificationFormatter,
  Notification,
  PercentageNotification,
  Period,
  PeriodHelper,
} from '@src/domain';
import { percentage, toMap, toMapArray } from '@src/lib';

const PERIOD_COLUMNS = [
  Period.DAILY,
  Period.WEEKLY,
  Period.MONTHLY,
  Period.YEARLY,
];

const PAD_STRING = ' ';
const COLUMN_LENGTH = 8;

export class DiscordByCryptoFormatter implements INotificationFormatter {
  format(notification: Notification): string {
    const byCrypto = toMapArray(notification.percentages, 'symbol');
    const triggered = Object.fromEntries(
      Object.entries(byCrypto)
        .filter(([_symbol, percentages]) =>
          percentages.reduce((result, curr) => curr.triggered || result, false),
        )
        .map(([symbol, percentages]) => {
          return [symbol, toMap(percentages, 'period')];
        }),
    );

    return ['```', this.formatPercentages(triggered), '```'].join('\n');
  }

  private formatPercentages(
    percentages: Record<string, Record<Period, PercentageNotification>>,
  ): string {
    const header = [...PERIOD_COLUMNS.map(PeriodHelper.toReadable), 'Name'];

    const data = Object.entries(percentages).map(([symbol, map]) => [
      ...PERIOD_COLUMNS.map((period) => {
        if (!(period in map)) return '-';

        return percentage(map[period].difference, {
          decimalPlaces: 1,
          includeSymbol: false,
        });
      }),
      symbol,
    ]);

    return [header, ...data]
      .map((row) =>
        row.map((item) => item.padEnd(COLUMN_LENGTH, PAD_STRING)).join(''),
      )
      .join('\n');
  }
}

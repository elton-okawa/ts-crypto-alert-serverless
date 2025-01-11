export function dollar(value: number): string {
  if (value > 1) {
    return `$${value.toFixed(2)}`;
  } else {
    const decimal = value.toString().split('.')[1];
    const index = decimal.search(/[1-9]/);

    return `${value.toFixed(index + 3)}`;
  }
}

export type PercentageOptions = {
  decimalPlaces?: number;
  includeSymbol?: boolean;
};

export function percentage(
  value: number | undefined,
  options: PercentageOptions = {},
): string {
  if (!value) {
    return '-';
  }

  const decimalPlaces = options.decimalPlaces ?? 2;
  const includeSymbol = options.includeSymbol ?? true;

  const percentage = Math.abs(value * 100);
  const signal = value > 0 ? '+' : '-';
  const symbol = includeSymbol ? '%' : '';
  return `${signal}${percentage.toFixed(decimalPlaces)}${symbol}`;
}

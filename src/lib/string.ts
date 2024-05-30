export function dollar(value: number): string {
  if (value > 1) {
    return `$${value.toFixed(2)}`;
  } else {
    const decimal = value.toString().split('.')[1];
    const index = decimal.search(/[1-9]/);

    return `${value.toFixed(index + 3)}`;
  }
}

export function percentage(value: number): string {
  const percentage = Math.abs(value * 100);
  const signal = value > 0 ? '+' : '-';
  return `%${signal}${percentage.toFixed(2)}`;
}

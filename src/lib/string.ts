export function dollar(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function percentage(value: number): string {
  const percentage = Math.abs(value * 100);
  const signal = value > 0 ? '+' : '-';
  return `%${signal}${percentage.toFixed(2)}`;
}

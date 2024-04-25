export function toMap<
  K extends string | number | symbol,
  T extends Record<K, Object>,
>(values: T[], key: K): Record<string, T> {
  return values.reduce(
    (map, current) => {
      map[current[key].toString()] = current;
      return map;
    },
    {} as Record<string, T>,
  );
}

export function toMap<
  K extends string | number | symbol,
  T extends Record<K, Object>,
>(values: T[], key: K, formatKey?: (v: T[K]) => string): Record<string, T> {
  return values.reduce(
    (map, current) => {
      const mapKey = formatKey
        ? formatKey(current[key])
        : current[key].toString();
      map[mapKey] = current;
      return map;
    },
    {} as Record<string, T>,
  );
}

export function toMapArray<T extends Record<string, any>, K extends keyof T>(
  values: T[],
  key: K,
): Record<T[K], T[]> {
  return values.reduce(
    (map, current) => {
      if (!(current[key].toString() in map)) {
        map[current[key].toString()] = [];
      }
      map[current[key].toString()].push(current);

      return map;
    },
    {} as Record<T[K], T[]>,
  );
}

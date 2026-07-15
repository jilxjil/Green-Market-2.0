export const analyticsRanges = [7, 30, 90] as const;

export function parseAnalyticsRange(value: string | undefined) {
  const parsed = Number(value);
  return analyticsRanges.includes(parsed as (typeof analyticsRanges)[number]) ? parsed : 30;
}

export function rangeStart(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days + 1);
  return date;
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function buildDailySeries<T>(
  rows: T[],
  days: number,
  getDate: (row: T) => Date,
  getValue: (row: T) => number
) {
  const start = rangeStart(days);
  const values = new Map<string, number>();
  for (const row of rows) {
    const date = getDate(row);
    if (date >= start) values.set(dateKey(date), (values.get(dateKey(date)) ?? 0) + getValue(row));
  }
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return { date, value: values.get(dateKey(date)) ?? 0 };
  });
}

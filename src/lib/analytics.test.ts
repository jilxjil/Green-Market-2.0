import { describe, expect, it, vi } from "vitest";
import { buildDailySeries, parseAnalyticsRange } from "./analytics";

describe("analytics ranges", () => {
  it("accepts supported ranges and defaults invalid values", () => {
    expect(parseAnalyticsRange("7")).toBe(7);
    expect(parseAnalyticsRange("365")).toBe(30);
  });
  it("groups values by day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-14T12:00:00Z"));
    const rows = [{ date: new Date("2026-07-14T08:00:00Z"), value: 12 }];
    const result = buildDailySeries(rows, 7, (row) => row.date, (row) => row.value);
    expect(result).toHaveLength(7);
    expect(result.at(-1)?.value).toBe(12);
    vi.useRealTimers();
  });
});

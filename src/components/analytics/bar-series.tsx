export function BarSeries({ data, valueLabel }: { data: { date: Date; value: number }[]; valueLabel: (value: number) => string }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const visible = data.length > 31 ? data.filter((_, index) => index % 3 === 0 || index === data.length - 1) : data;
  return (
    <div className="mt-5 overflow-x-auto pb-2">
      <div className="flex h-52 min-w-[560px] items-end gap-1.5" role="img" aria-label="Activity over selected date range">
        {visible.map((item) => (
          <div key={item.date.toISOString()} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
            <div title={`${item.date.toLocaleDateString()}: ${valueLabel(item.value)}`} className="relative min-h-1 rounded-t bg-primary/80 transition hover:bg-primary" style={{ height: `${Math.max((item.value / max) * 100, 2)}%` }}>
              <span className="sr-only">{item.date.toLocaleDateString()}: {valueLabel(item.value)}</span>
            </div>
            <span className="truncate text-center text-[10px] text-muted-foreground">{item.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

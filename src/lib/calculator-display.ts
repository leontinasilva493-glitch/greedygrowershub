const standardFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

export function formatCalculatorMetric(value: number): string {
  return Math.abs(value) >= 1_000_000
    ? compactFormatter.format(value)
    : standardFormatter.format(value);
}

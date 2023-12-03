export default function formatNumber(num: number) {
  const map = [
    { suffix: 't', threshold: 1e12, precision: 1 },
    { suffix: 'b', threshold: 1e9, precision: 1 },
    { suffix: 'm', threshold: 1e6, precision: 1},
    { suffix: 'k', threshold: 1e3, precision: 1 },
    { suffix: '', threshold: 1, precision: 0 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(found.precision) + found.suffix;
    return formatted;
  }

  return num;
}

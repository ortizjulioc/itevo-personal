export function formatCompactNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000_000) {
    return `${sign}${Number((absValue / 1_000_000_000).toFixed(1))}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${Number((absValue / 1_000_000).toFixed(1))}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}${Number((absValue / 1_000).toFixed(1))}K`;
  }
  
  return `${sign}${Number(absValue.toFixed(1))}`;
}

export function formatFullNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

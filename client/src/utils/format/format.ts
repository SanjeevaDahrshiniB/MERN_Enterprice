/**
 * Formats nullable strings or values with a clean fallback ('N/A')
 */
export function formatValue(
  value: string | number | null | undefined,
  fallback: string = 'N/A'
): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' && value.trim() === '') return fallback;
  return String(value);
}

/**
 * Formats a number as Indian Currency (₹)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Safe value formatter that prevents empty strings ("") or missing blanks.
 * Always returns a clear fallback (default 'N/A') so developers and users
 * can distinguish between present data and omitted fields.
 */
export function formatValue(value: unknown, fallback: string = 'N/A'): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return fallback;
  }
  return String(value);
}

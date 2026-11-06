/**
 * Returns the client's detected local timezone (e.g., 'Asia/Kolkata', 'America/New_York')
 */
export function getClientTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

/**
 * Formats a date into a localized date string (e.g. "05 Nov 2026").
 * Returns fallback ('N/A') if date is null, undefined, or invalid.
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  timeZone: string = getClientTimezone(),
  fallback: string = 'N/A'
): string {
  if (!dateInput) return fallback;

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return fallback;

    return new Intl.DateTimeFormat('en-IN', {
      timeZone,
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return fallback;
  }
}

/**
 * Formats a date and time into a localized string (e.g. "05 Nov 2026, 06:15 PM").
 * Returns fallback ('N/A') if date is invalid or falsy.
 */
export function formatDateTime(
  dateInput: string | Date | null | undefined,
  timeZone: string = getClientTimezone(),
  fallback: string = 'N/A'
): string {
  if (!dateInput) return fallback;

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return fallback;

    return new Intl.DateTimeFormat('en-IN', {
      timeZone,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch {
    return fallback;
  }
}

/**
 * Given a localized date (e.g. '2026-11-05') and a timezone,
 * computes the day's start and end timestamps converted accurately into UTC ISO-8601 strings
 */
export function getISODayRange(
  dateStr: string,
  timeZone: string = getClientTimezone()
): { startDate: string; endDate: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) {
    const now = new Date();
    return { startDate: now.toISOString(), endDate: now.toISOString() };
  }

  const startLocal = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const endLocal = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  const sample = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const invDate = new Date(sample.toLocaleString('en-US', { timeZone }));
  const diffMs = sample.getTime() - invDate.getTime();

  const startDate = new Date(startLocal.getTime() + diffMs).toISOString();
  const endDate = new Date(endLocal.getTime() + diffMs).toISOString();

  return { startDate, endDate };
}

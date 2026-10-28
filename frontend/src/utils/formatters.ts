import { format, parseISO, differenceInCalendarDays, isValid } from 'date-fns';

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch (err) {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      const fallback = new Date(dateString);
      return isValid(fallback) ? format(fallback, formatStr) : dateString;
    }
    return format(date, formatStr);
  } catch {
    return dateString;
  }
}

export function formatTripDates(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return '';
  const start = formatDate(startDate, 'MMM d');
  const end = formatDate(endDate, 'MMM d, yyyy');
  return `${start} - ${end}`;
}

export function calculateDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const diff = differenceInCalendarDays(end, start);
    return diff >= 0 ? diff + 1 : 1;
  } catch {
    return 1;
  }
}

export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '30m';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

export function getInitials(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function capitalizeFirstLetter(string: string): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

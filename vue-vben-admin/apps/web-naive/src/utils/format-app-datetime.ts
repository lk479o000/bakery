import dayjs from 'dayjs';

/** Display pattern keyed by app i18n locale (dayjs performs parsing/formatting). */
function dateTimePatternForLocale(locale: string): string {
  return locale === 'en-US' ? 'MMM D, YYYY h:mm:ss A' : 'YYYY-MM-DD HH:mm:ss';
}

export function formatAppDateTime(
  value: string | number | Date | null | undefined,
  locale: string,
): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const d = dayjs(value);
  return d.isValid() ? d.format(dateTimePatternForLocale(locale)) : String(value);
}

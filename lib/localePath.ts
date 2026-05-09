const LOCALE_PREFIX = /^\/(en|ta|si)(\/|$)/;

export function stripLocalePrefix(pathname: string): string {
  if (!pathname) return '/';
  return pathname.replace(LOCALE_PREFIX, '/') || '/';
}

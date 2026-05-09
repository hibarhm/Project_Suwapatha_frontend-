import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// Locale middleware keeps URLs locale-prefixed and remembers user selection via cookie.
export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

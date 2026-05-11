'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {useTransition} from 'react';
import type {AppLocale} from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onLocaleChange = (nextLocale: AppLocale) => {
    startTransition(() => {
      // Persist selection for future visits (next-intl middleware also keeps this cookie in sync).
      // This makes the preference sticky even if the next navigation doesn't hit the server immediately.
      document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
      // Replacing the current pathname updates all translated UI strings in-place.
      router.replace(pathname, {locale: nextLocale});
    });
  };

  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <span>{t('language')}</span>
      <select
        value={locale}
        disabled={isPending}
        onChange={(event) => onLocaleChange(event.target.value as AppLocale)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#94B4C1]"
        aria-label={t('language')}
      >
        <option value="en">English</option>
        <option value="ta">தமிழ்</option>
        <option value="si">සිංහල</option>
      </select>
    </label>
  );
}

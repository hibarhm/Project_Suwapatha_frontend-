'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {useTransition} from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onLocaleChange = (nextLocale: string) => {
    startTransition(() => {
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
        onChange={(event) => onLocaleChange(event.target.value)}
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

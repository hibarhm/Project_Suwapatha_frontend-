'use client';

import Link from 'next/link';
import {useTranslations} from 'next-intl';
import RequireRole from '@/app/components/RequireRole';
import SuperAdminLayout from '@/app/components/superAdminLayout';

export default function SuperAdminDashboardPage() {
  const t = useTranslations('superAdminDashboard');

  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      <SuperAdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t('createAdminTitle')}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {t('createAdminDescription')}
          </p>
          <Link
            href="/super-admin/hospitals"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#94B4C1] text-white hover:bg-[#7fa8b8] font-medium"
          >
            {t('goToHospitals')}
          </Link>
        </div>
      </SuperAdminLayout>
    </RequireRole>
  );
}


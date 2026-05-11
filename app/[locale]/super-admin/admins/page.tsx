'use client';

import RequireRole from '@/app/components/RequireRole';
import SuperAdminLayout from '@/app/components/superAdminLayout';
import {useTranslations} from 'next-intl';

export default function SuperAdminAdminsPage() {
  const t = useTranslations('superAdminAdminsPage');

  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      <SuperAdminLayout>
        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('descriptionStart')} <span className="font-semibold">{t('hospitals')}</span> {t('descriptionEnd')}
          </p>
        </div>
      </SuperAdminLayout>
    </RequireRole>
  );
}


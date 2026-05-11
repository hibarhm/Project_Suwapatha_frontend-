'use client';

import RequireRole from '@/app/components/RequireRole';
import SuperAdminLayout from '@/app/components/superAdminLayout';
import { SUPER_ADMIN_ENDPOINTS } from '@/app/api/superAdmin/superAdminApi';
import {useTranslations} from 'next-intl';

export default function SuperAdminSettingsPage() {
  const t = useTranslations('superAdminSettingsPage');

  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      <SuperAdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t('endpointsTitle')}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {t('description')}
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 p-3 border rounded-lg">
              <span className="text-gray-700 font-medium">{t('hospitals')}</span>
              <code className="text-xs bg-gray-50 border px-2 py-1 rounded">{SUPER_ADMIN_ENDPOINTS.HOSPITALS}</code>
            </div>
            <div className="flex items-center justify-between gap-4 p-3 border rounded-lg">
              <span className="text-gray-700 font-medium">{t('createHospitalAdmin')}</span>
              <code className="text-xs bg-gray-50 border px-2 py-1 rounded">
                {`/api/super-admin/hospitals/{hospitalId}/admins`}
              </code>
            </div>
          </div>
        </div>
      </SuperAdminLayout>
    </RequireRole>
  );
}


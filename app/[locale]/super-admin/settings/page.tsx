'use client';

import RequireRole from '@/app/components/RequireRole';
import SuperAdminLayout from '@/app/components/superAdminLayout';
import { SUPER_ADMIN_ENDPOINTS } from '@/app/api/superAdmin/superAdminApi';

export default function SuperAdminSettingsPage() {
  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      <SuperAdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Super Admin endpoint configuration</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Backend endpoints</h2>
          <p className="text-sm text-gray-600 mb-4">
            Super Admin is restricted to creating hospital admin credentials only.
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 p-3 border rounded-lg">
              <span className="text-gray-700 font-medium">Hospitals</span>
              <code className="text-xs bg-gray-50 border px-2 py-1 rounded">{SUPER_ADMIN_ENDPOINTS.HOSPITALS}</code>
            </div>
            <div className="flex items-center justify-between gap-4 p-3 border rounded-lg">
              <span className="text-gray-700 font-medium">Create hospital admin</span>
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


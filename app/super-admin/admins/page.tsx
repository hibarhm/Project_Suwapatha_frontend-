'use client';

import RequireRole from '@/app/components/RequireRole';
import SuperAdminLayout from '@/app/components/superAdminLayout';

export default function SuperAdminAdminsPage() {
  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      <SuperAdminLayout>
        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
          <p className="text-sm text-gray-600 mt-1">
            Super Admin does not manage admin features. Use <span className="font-semibold">Hospitals</span> to create
            credentials for a specific hospital.
          </p>
        </div>
      </SuperAdminLayout>
    </RequireRole>
  );
}


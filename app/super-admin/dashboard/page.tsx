'use client';

import Link from 'next/link';
import RequireRole from '@/app/components/RequireRole';
import SuperAdminLayout from '@/app/components/superAdminLayout';

export default function SuperAdminDashboardPage() {
  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      <SuperAdminLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Super Admin can only create hospital admin credentials for a selected hospital.
          </p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Create hospital admin</h2>
          <p className="text-sm text-gray-600 mb-4">
            Go to Hospitals, choose a hospital, and create credentials for its admin.
          </p>
          <Link
            href="/super-admin/hospitals"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#94B4C1] text-white hover:bg-[#7fa8b8] font-medium"
          >
            Go to Hospitals
          </Link>
        </div>
      </SuperAdminLayout>
    </RequireRole>
  );
}


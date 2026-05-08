'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import RequireRole from '@/app/components/RequireRole';

export default function SuperAdminRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Allow the login page to render without role gating.
  if (pathname === '/super-admin/login') return <>{children}</>;

  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      {children}
    </RequireRole>
  );
}


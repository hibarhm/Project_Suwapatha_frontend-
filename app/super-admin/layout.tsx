'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import RequireRole from '@/app/components/RequireRole';
import {stripLocalePrefix} from '@/lib/localePath';

export default function SuperAdminRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const normalizedPathname = stripLocalePrefix(pathname ?? '/');

  // Allow the login page to render without role gating.
  if (normalizedPathname === '/super-admin/login') return <>{children}</>;

  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      {children}
    </RequireRole>
  );
}


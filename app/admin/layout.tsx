'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import RequireRole from '@/app/components/RequireRole';

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Allow the login page to render without role gating.
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <RequireRole allowedRoles={['ADMIN']} redirectTo="/admin/login">
      {children}
    </RequireRole>
  );
}


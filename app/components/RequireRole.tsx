'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/app/api/auth/authApi';
import {stripLocalePrefix} from '@/lib/localePath';

type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'SUPER_ADMIN' | string;

export default function RequireRole({
  allowedRoles,
  children,
  redirectTo = '/login',
}: {
  allowedRoles: Role[];
  children: ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPathname = stripLocalePrefix(pathname ?? '/');
  const [ready, setReady] = useState(false);

  const allowed = useMemo(() => new Set(allowedRoles), [allowedRoles]);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      router.replace(redirectTo);
      return;
    }

    const user = authApi.getStoredUser();
    const role = (user?.role ?? '') as Role;

    if (!allowed.has(role)) {
      // Prevent redirect loop if a user hits the login page already
      if (!normalizedPathname.startsWith('/login')) {
        router.replace(redirectTo);
      }
      return;
    }

    setReady(true);
  }, [allowed, normalizedPathname, redirectTo, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperAdminSidebar from '@/app/components/superAdminSidebar';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isNewUser');
    sessionStorage.clear();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar sidebarOpen={sidebarOpen} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Suwapatha Super Admin</span>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}


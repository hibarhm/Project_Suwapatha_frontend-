'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import LaboratorySidebar from './laboratorySidebar';
import API_BASE_URL from '@/app/api/api';

interface LaboratoryLayoutProps {
  children: ReactNode;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  hospitalId?: string;
}

export default function LaboratoryLayout({ children }: LaboratoryLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      
      // Check if user is LABORATORY staff
      if (data.role !== 'LABORATORY' && data.role !== 'ADMIN') {
        router.push('/unauthorized');
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push('/');
  };

  const getInitials = () => {
    if (!profile) return 'LB';
    const firstInitial = profile.firstName?.charAt(0)?.toUpperCase() || 'L';
    const lastInitial = profile.lastName?.charAt(0)?.toUpperCase() || 'B';
    return `${firstInitial}${lastInitial}`;
  };

  const getFullName = () => {
    if (!profile) return 'Loading...';
    return `${profile.firstName} ${profile.lastName}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <LaboratorySidebar sidebarOpen={sidebarOpen} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/laboratory/settings')}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              title="View profile"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                <p className="text-xs text-gray-600">Laboratory Staff</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#7fa8b8] flex items-center justify-center text-white font-semibold text-sm">
                {getInitials()}
              </div>
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

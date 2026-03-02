'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from './doctorSidebar';

interface DoctorLayoutProps {
  children: ReactNode;
}

interface DoctorProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  nic?: string;
  doctorId?: string;
  specialization?: string;
}

export default function DoctorLayout({ children }: DoctorLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchProfile();
    fetchNotificationCount();
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

      const response = await fetch('http://localhost:8080/api/users/me', {
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
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const token = getAuthToken();
      
      const response = await fetch('http://localhost:8080/api/doctor/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.count || 0);
      }
    } catch (err) {
      console.error('Error fetching notification count:', err);
      setNotificationCount(0);
    }
  };

  const handleLogout = () => {
    // Clear any authentication tokens/session data here
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    sessionStorage.clear();
    // Redirect to homepage
    router.push('/');
  };

  const getInitials = () => {
    if (!profile) return 'DR';
    const firstInitial = profile.firstName?.charAt(0)?.toUpperCase() || 'D';
    const lastInitial = profile.lastName?.charAt(0)?.toUpperCase() || 'R';
    return `${firstInitial}${lastInitial}`;
  };

  const getFullName = () => {
    if (!profile) return 'Loading...';
    return `Dr. ${profile.firstName} ${profile.lastName}`;
  };

  const getSpecialization = () => {
    if (!profile) return 'Doctor';
    return profile.specialization || 'General Physician';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar sidebarOpen={sidebarOpen} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
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
            {/* Notification Bell */}
            <button 
              onClick={() => router.push('/doctor/notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View notifications"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Profile Section */}
            <button
              onClick={() => router.push('/doctor/settings')}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              title="View profile"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                <p className="text-xs text-gray-600">{getSpecialization()}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#7fa8b8] flex items-center justify-center text-white font-semibold text-sm">
                {getInitials()}
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
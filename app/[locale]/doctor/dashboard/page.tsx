'use client';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import DoctorLayout from '@/app/components/doctorLayout';
import { doctorApi, DoctorAvailability } from '@/app/api/doctor/doctorApi';
import API_BASE_URL from '@/app/api/api';
import RequireRole from '@/app/components/RequireRole';

// ── Types ────────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalPatientsToday: number;
  consultationsThisWeek: number;
  averageWaitTime: number;
  changeFromYesterday: number;
  changeFromLastWeek: number;
  changeFromLastMonth: number;
}

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  queueNumber: number;
  appointmentDate: string;
  hospitalName: string;
  doctorName: string;
  room: string;
  status: string;
  estimatedWaitMinutes: number;
  patientId: string;
}

interface DoctorProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  nic?: string;
  doctorId?: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon?: string;
}

export default function DoctorDashboard() {
  const t = useTranslations('doctorDashboard');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for real data
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatientsToday: 0,
    consultationsThisWeek: 0,
    averageWaitTime: 0,
    changeFromYesterday: 0,
    changeFromLastWeek: 0,
    changeFromLastMonth: 0,
  });
  const [availability, setAvailability] = useState<DoctorAvailability | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [patientVisitsData, setPatientVisitsData] = useState<any[]>([]);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    fetchAllData();

    // Set up real-time polling every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Client-side role check
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/');
        return;
      }

      const user = JSON.parse(storedUser);
      if (user.role !== 'DOCTOR') {
        setError(t('errors.unauthorized'));
        setLoading(false);
        return;
      }

      await Promise.all([
        fetchProfile(),
        fetchDashboardData(),
        fetchAvailability()
      ]);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();

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
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await doctorApi.getDashboardData();
      setStats(data.stats);
      setPatientVisitsData(data.patientVisitsData);
      setTodayAppointments(data.upcomingAppointments as any);
      setNotifications(data.notifications as any);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const fetchAvailability = async () => {
    try {
      const data = await doctorApi.getAvailabilityToday();
      setAvailability(data);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const toggleAvailability = async () => {
    if (!availability || isToggling) return;

    setIsToggling(true);
    try {
      const newStatus = !availability.available;
      const data = await doctorApi.setAvailabilityToday(newStatus, '');
      setAvailability(data);
    } catch (err) {
      console.error('Error toggling availability:', err);
      alert(t('errors.updateAvailabilityFailed'));
    } finally {
      setIsToggling(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = getAuthToken();

      await fetch(`${API_BASE_URL}/api/doctor/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local state
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  if (error) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('errorTitle')}</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchAllData}
              className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors"
            >
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return (
          <svg className="w-4 h-4 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'message':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getAppointmentStatusLabel = (status: string) => {
    switch (status) {
      case 'BOOKED': return t('appointments.status.booked');
      case 'COMPLETED': return t('appointments.status.completed');
      case 'CANCELLED': return t('appointments.status.cancelled');
      case 'CHECKED_IN': return t('appointments.status.checkedIn');
      default: return status;
    }
  };

  return (
    <RequireRole allowedRoles={['DOCTOR']} redirectTo="/login/doctor">
      <DoctorLayout>
        <div className="p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('welcome', {name: profile?.lastName || t('doctorFallback')})}
            </h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>

          {/* Availability Toggle */}
          <div className="mb-8 bg-white rounded-xl border border-[#94B4C1]/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${availability?.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t('attendance.title')}</h2>
                <p className="text-sm text-gray-600">
                  {availability?.available ? t('attendance.activeText') : t('attendance.inactiveText')}
                </p>
              </div>
            </div>
            <button
              onClick={toggleAvailability}
              disabled={isToggling}
              className={`px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 ${availability?.available
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-[#94B4C1] text-white hover:bg-[#7fa8b8] shadow-md shadow-[#94B4C1]/20'
              }`}
            >
              {isToggling && <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
              {availability?.available ? t('attendance.markOut') : t('attendance.markAvailable')}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t('stats.totalPatientsToday')}</p>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.totalPatientsToday}</p>
              <p className={`text-sm ${stats.changeFromYesterday >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {t('stats.sinceYesterday', {value: `${stats.changeFromYesterday >= 0 ? '+' : ''}${stats.changeFromYesterday}`})}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t('stats.consultationsThisWeek')}</p>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.consultationsThisWeek}</p>
              <p className={`text-sm ${stats.changeFromLastWeek >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {t('stats.fromLastWeek', {value: `${stats.changeFromLastWeek >= 0 ? '+' : ''}${stats.changeFromLastWeek}`})}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{t('stats.averageWaitTime')}</p>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold text-[#94B4C1] mb-2">{t('stats.waitMins', {value: stats.averageWaitTime})}</p>
              <p className={`text-sm ${stats.changeFromLastMonth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {t('stats.fromLastMonth', {value: `${stats.changeFromLastMonth >= 0 ? '+' : ''}${stats.changeFromLastMonth}`})}
              </p>
            </div>
          </div>

          {/* Charts and Notifications Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Patient Visits Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">{t('charts.patientVisits')}</h3>
                <button onClick={fetchAllData} className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                  {t('refresh')}
                </button>
              </div>
              <div className="h-64">
                {(() => {
                  const maxVisits = Math.max(...patientVisitsData.map(d => d.visits), 10);
                  const chartHeight = 150;
                  const chartYBase = 200;
                  return (
                    <svg className="w-full h-full" viewBox="0 0 600 250">
                      {[50, 100, 150, 200].map(y => <line key={y} x1="50" y1={y} x2="550" y2={y} stroke="#e5e7eb" strokeWidth="1" />)}
                      {patientVisitsData.length > 1 && (
                        <polyline
                          points={patientVisitsData.map((d, i) => `${80 + i * 80},${chartYBase - (d.visits / maxVisits) * chartHeight}`).join(' ')}
                          fill="none" stroke="#94B4C1" strokeWidth="3"
                        />
                      )}
                      <text x="15" y="55" fontSize="12" fill="#6b7280">{maxVisits}</text>
                      <text x="15" y="205" fontSize="12" fill="#6b7280">0</text>
                      {patientVisitsData.map((data, i) => <text key={i} x={70 + i * 80} y="225" fontSize="12" fill="#6b7280">{data.month}</text>)}
                    </svg>
                  );
                })()}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">{t('notifications.title')}</h3>
                <button onClick={fetchDashboardData} className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium">{t('refresh')}</button>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className={`flex gap-3 p-3 rounded-lg border transition-colors ${notification.isRead ? 'border-gray-100 bg-gray-50' : 'border-[#94B4C1]/20 bg-[#94B4C1]/5'}`}>
                      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${notification.type === 'appointment' ? 'bg-[#94B4C1]/10' : 'bg-blue-100'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm mb-1 ${notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>{notification.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      <button onClick={() => deleteNotification(notification.id)} className="p-1 hover:bg-gray-200 rounded flex-shrink-0 h-6">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">{t('notifications.emptyTitle')}</div>
                )}
              </div>
            </div>
          </div>

          {/* Appointments Table (Full Width) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">{t('appointments.title')}</h3>
              <button onClick={fetchDashboardData} className="px-4 py-2 text-sm font-medium text-[#94B4C1] bg-[#94B4C1]/5 rounded-lg hover:bg-[#94B4C1]/10">{t('refresh')}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-3 text-sm font-bold text-gray-700 uppercase">{t('appointments.table.patientName')}</th>
                    <th className="text-left py-4 px-3 text-sm font-bold text-gray-700 uppercase">{t('appointments.table.queueNo')}</th>
                    <th className="text-left py-4 px-3 text-sm font-bold text-gray-700 uppercase">{t('appointments.table.hospital')}</th>
                    <th className="text-left py-4 px-3 text-sm font-bold text-gray-700 uppercase">{t('appointments.table.status')}</th>
                    <th className="text-right py-4 px-3 text-sm font-bold text-gray-700 uppercase">{t('appointments.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 group">
                        <td className="py-5 px-3">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#94B4C1] flex items-center justify-center text-white font-bold">{app.patientName.charAt(0)}</div>
                            <span className="text-sm font-semibold">{app.patientName}</span>
                          </div>
                        </td>
                        <td className="py-5 px-3">#{app.queueNumber}</td>
                        <td className="py-5 px-3 text-sm">{app.hospitalName}</td>
                        <td className="py-5 px-3">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${app.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                            {getAppointmentStatusLabel(app.status)}
                          </span>
                        </td>
                        <td className="py-5 px-3 text-right">
                          <button onClick={() => router.push(`/doctor/myPatients/${app.patientId}`)} className="p-2 text-gray-400 hover:text-[#94B4C1] rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-500">{t('appointments.emptyTitle')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DoctorLayout>
    </RequireRole>
  );
}
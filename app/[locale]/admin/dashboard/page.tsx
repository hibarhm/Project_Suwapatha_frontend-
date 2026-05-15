'use client';
import { useState, useEffect } from 'react';
import {useRouter} from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import AdminLayout from '@/app/components/adminLayout';
import API_BASE_URL from '@/app/api/api';
import { adminApi, DoctorAvailability } from '@/app/api/admin/adminApi';
import CreateSessionModal from '@/app/components/CreateSessionModal';

interface HospitalInfo {
  id: string;
  name: string;
  location: string;
  district: string;
  province: string;
  type: string;
  address: string;
  phone: string;
}

interface TodayStats {
  totalPatients: number;
  allocatedPatients: number;
  unallocatedPatients: number;
  activeDoctors: number;
  totalDoctors: number;
  activeSessions: number;
  totalSessions: number;
  monthlyActiveSessions: number;
  monthlyTotalSessions: number;
  monthlyCompletedPatients: number;
}

interface Doctor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  enabled: boolean;
}

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  doctorName: string;
  room: string;
  status: string;
  currentQueueCount: number;
  maxQueueSize: number;
}

export default function AdminDashboard() {
  const t = useTranslations('adminDashboard');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([0]);

  // State for real data
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [todayStats, setTodayStats] = useState<TodayStats>({
    totalPatients: 0,
    allocatedPatients: 0,
    unallocatedPatients: 0,
    activeDoctors: 0,
    totalDoctors: 0,
    activeSessions: 0,
    totalSessions: 0,
    monthlyActiveSessions: 0,
    monthlyTotalSessions: 0,
    monthlyCompletedPatients: 0
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<DoctorAvailability[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Create Session Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessionFormData, setSessionFormData] = useState({
    date: '',
    totalSlots: 30,
    slotDuration: 15,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchHospitalInfo(),
        fetchTodayStats(),
        fetchDoctors(),
        fetchTodaySessions(),
        fetchAvailableDoctors()
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(t('errorTitle'));
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalInfo = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/hospital-info`, {
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
        throw new Error(t('errors.fetchHospitalInfo'));
      }

      const data = await response.json();
      setHospitalInfo(data);
    } catch (err) {
      console.error('Error fetching hospital info:', err);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/opd/stats/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.fetchTodayStats'));
      }

      const data = await response.json();
      setTodayStats(data);
    } catch (err) {
      console.error('Error fetching today stats:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.fetchDoctors'));
      }

      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAvailableDoctors = async () => {
    try {
      const data = await adminApi.getAvailableDoctorsToday();
      setAvailableDoctors(data);
    } catch (err) {
      console.error('Error fetching available doctors:', err);
    }
  };

  const fetchTodaySessions = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/opd/sessions/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.fetchTodaySessions'));
      }

      const data = await response.json();
      setTodaySessions(data);

      // Generate alerts based on real data
      generateAlerts(data);
    } catch (err) {
      console.error('Error fetching today sessions:', err);
    }
  };

  const generateAlerts = (sessions: Session[]) => {
    const newAlerts = [];

    // Check for sessions without doctors
    const sessionsWithoutDoctors = sessions.filter(
      s => !s.doctorName || s.doctorName === t('common.notAssigned')
    );

    if (sessionsWithoutDoctors.length > 0) {
      newAlerts.push({
        type: 'warning',
        title: t('alerts.sessionWithoutDoctorTitle', {count: sessionsWithoutDoctors.length}),
        description: t('alerts.sessionWithoutDoctorDescription')
      });
    }

    // Check for sessions without rooms
    const sessionsWithoutRooms = sessions.filter(
      s => !s.room || s.room === t('common.notAssigned')
    );

    if (sessionsWithoutRooms.length > 0) {
      newAlerts.push({
        type: 'warning',
        title: t('alerts.sessionWithoutRoomTitle', {count: sessionsWithoutRooms.length}),
        description: t('alerts.sessionWithoutRoomDescription')
      });
    }

    // Check for high patient load
    const highLoadSessions = sessions.filter(
      s => (s.currentQueueCount / s.maxQueueSize) > 0.8
    );

    if (highLoadSessions.length > 0) {
      newAlerts.push({
        type: 'warning',
        title: t('alerts.highPatientLoadTitle', {count: highLoadSessions.length}),
        description: t('alerts.highPatientLoadDescription')
      });
    }

    // Check for unallocated patients
    if (todayStats.unallocatedPatients > 0) {
      newAlerts.push({
        type: 'info',
        title: t('alerts.unallocatedPatientsTitle', {count: todayStats.unallocatedPatients}),
        description: t('alerts.unallocatedPatientsDescription')
      });
    }

    setAlerts(newAlerts.length > 0 ? newAlerts : [
      {
        type: 'info',
        title: t('alerts.allSystemsNormalTitle'),
        description: t('alerts.allSystemsNormalDescription')
      }
    ]);
  };

  // Calculate average waiting time based on queue counts
  const calculateAvgWaitingTime = () => {
    if (todaySessions.length === 0) return t('common.zeroMinutes');

    const totalWaitTime = todaySessions.reduce((sum, session) => {
      // Assuming 15 minutes per patient
      return sum + (session.currentQueueCount * 15);
    }, 0);

    const avgTime = Math.round(totalWaitTime / todaySessions.length);
    return t('common.minutes', {value: avgTime});
  };

  const handleCreateSession = () => {
    setShowCreateModal(true);
  };

  const handleCreateSessionSubmit = async () => {
    try {
      await adminApi.createSession({
        date: sessionFormData.date,
        startTime: '08:00',
        endTime: '12:00',
        department: t('common.generalDepartment'),
        maxQueueSize: sessionFormData.totalSlots,
        slotDuration: sessionFormData.slotDuration,
      });
      setShowCreateModal(false);
      setSessionFormData({ date: '', totalSlots: 30, slotDuration: 15 });
      // Refresh dashboard data to show the new session
      await fetchAllData();
    } catch (err: any) {
      alert(err.message || t('errors.createSession'));
    }
  };

  const handleViewAllSessions = () => {
    router.push('/admin/opd-management');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: t('stats.monthlyCompletedPatients'),
      value: todayStats.monthlyCompletedPatients.toString(),
      change: t('stats.completedThisMonth'),
      icon: (
        <img width="24" height="24" src="https://img.icons8.com/ios-filled/50/crowd.png" alt="crowd" />
      ),
      color: '#94B4C1'
    },
    {
      title: t('stats.activeSessionsMonth'),
      value: todayStats.monthlyActiveSessions.toString(),
      change: t('stats.totalSessionsMonth', {count: todayStats.monthlyTotalSessions}),
      icon: (
        <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/queue.png" alt="queue" />
      ),
      color: '#f97316'
    },
    {
      title: t('stats.avgWaitingTime'),
      value: calculateAvgWaitingTime(),
      change: t('stats.estimatedPerSession'),
      icon: (
        <img width="20" height="20" src="https://img.icons8.com/ios/50/time_2.png" alt="time" />
      ),
      color: '#6b7280'
    },
    {
      title: t('stats.totalDoctors'),
      value: todayStats.activeDoctors.toString(),
      change: t('stats.totalDoctorsToday', {count: todayStats.totalDoctors}),
      icon: (
        <img width="23" height="23" src="https://img.icons8.com/ios-glyphs/30/stethoscope.png" alt="stethoscope" />
      ),
      color: '#8b5cf6'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Hospital Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          {hospitalInfo && (
            <p className="text-gray-600 mt-1">
              {hospitalInfo.name} - {hospitalInfo.location}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-900">{s.title}</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-800 mt-1">{s.change}</p>
                </div>
                <span className="text-2xl">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left + Middle Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* {t('todaysSessions.title')} */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t('sessionManagement.title')}</h2>
              <button
                onClick={handleCreateSession}
                className="w-full bg-[#94B4C1] text-white py-3 rounded-lg mb-3 hover:bg-[#7fa8b8] transition-colors font-medium"
              >
                {t('sessionManagement.createNew')}
              </button>
              <button
                onClick={handleViewAllSessions}
                className="w-full bg-[#94B4C1]/10 text-[#94B4C1] py-3 rounded-lg hover:bg-[#94B4C1]/20 transition-colors font-medium"
              >
                {t('sessionManagement.viewAll')}
              </button>
            </div>

            {/* Doctor Availability */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t('attendance.title')}</h2>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                    {t('attendance.present', {count: availableDoctors.length})}
                  </span>
                  <button
                    onClick={async () => { await fetchDoctors(); await fetchAvailableDoctors(); }}
                    className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium"
                  >
                    {t('common.refresh')}
                  </button>
                </div>
              </div>

              {availableDoctors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{t('attendance.availableToday')}</h3>
                  <div className="space-y-3">
                    {availableDoctors.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                            {doc.doctorName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{doc.doctorName}</p>
                            <p className="text-xs text-gray-600">{doc.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push('/admin/opd-management')}
                          className="text-xs bg-white px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-100 font-medium"
                        >
                          {t('attendance.allocate')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">{t('attendance.allDoctors')}</h3>
              {doctors.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-gray-600 text-sm">{t('attendance.noDoctors')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-xs font-semibold text-gray-900">{t('attendance.table.name')}</th>
                        <th className="text-left py-3 text-xs font-semibold text-gray-900">{t('attendance.table.email')}</th>
                        <th className="text-left py-3 text-xs font-semibold text-gray-900">{t('attendance.table.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.slice(0, 5).map((doctor) => (
                        <tr key={doctor.id} className="border-b last:border-0">
                          <td className="py-4 text-sm font-medium text-gray-900">
                            {doctor.firstName} {doctor.lastName}
                          </td>
                          <td className="py-4 text-sm text-gray-600">
                            {doctor.email}
                          </td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${doctor.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : doctor.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                              }`}>
                              {doctor.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {doctors.length > 5 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => router.push('/admin/doctors')}
                        className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium"
                      >
                        {t('attendance.viewAllDoctors', {count: doctors.length})} →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Today's Sessions Overview */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t('todaysSessions.title')}</h2>
              {todaySessions.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 text-sm mb-4">{t('todaysSessions.empty')}</p>
                  <button
                    onClick={handleCreateSession}
                    className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors text-sm font-medium"
                  >
                    {t('todaysSessions.createFirst')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {session.startTime} - {session.endTime}
                        </p>
                        <p className="text-xs text-gray-600">
                          {session.doctorName} • {session.room}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {session.currentQueueCount}/{session.maxQueueSize}
                        </p>
                        <p className="text-xs text-gray-600">{t('todaysSessions.patients')}</p>
                      </div>
                    </div>
                  ))}
                  {todaySessions.length > 3 && (
                    <button
                      onClick={handleViewAllSessions}
                      className="w-full text-center text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium py-2"
                    >
                      {t('todaysSessions.viewAll', {count: todaySessions.length})} →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Alerts & Notifications */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">{t('alerts.title')}</h2>
              {alerts.map((alert, i) => (
                <div key={i} className="border rounded-lg mb-3 last:mb-0">
                  <button
                    onClick={() => setExpandedAlerts(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                    className="w-full flex items-start gap-3 p-4 hover:bg-gray-50"
                  >
                    <svg className={`w-5 h-5 mt-0.5 ${alert.type === 'warning' ? 'text-orange-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      {expandedAlerts.includes(i) && alert.description && (
                        <p className="text-xs text-gray-800 mt-1">{alert.description}</p>
                      )}
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedAlerts.includes(i) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#94B4C1]/10 to-[#A1C2BD]/10 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-gray-900">{t('quickActions.title')}</h3>
              <p className="text-sm text-gray-700 mb-4">{t('quickActions.subtitle')}</p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/admin/opd-management')}
                  className="w-full bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  {t('quickActions.manageSessions')}
                </button>
                <button
                  onClick={() => router.push('/admin/doctors')}
                  className="w-full bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  {t('quickActions.manageDoctors')}
                </button>
                <button
                  onClick={fetchAllData}
                  className="w-full bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  {t('quickActions.refreshDashboard')}
                </button>
              </div>
            </div>

            {/* Hospital Info Card */}
            {hospitalInfo && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">{t('hospitalInfo.title')}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">{t('hospitalInfo.name')}</p>
                    <p className="font-medium text-gray-900">{hospitalInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('hospitalInfo.type')}</p>
                    <p className="font-medium text-gray-900">{hospitalInfo.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('hospitalInfo.location')}</p>
                    <p className="font-medium text-gray-900">{hospitalInfo.district}, {hospitalInfo.province}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('hospitalInfo.phone')}</p>
                    <p className="font-medium text-gray-900">{hospitalInfo.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-6 text-center border-t">
          <p className="text-sm text-gray-800">{t('footer.rights')}</p>
        </footer>
      </div>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        formData={sessionFormData}
        setFormData={setSessionFormData}
        onCreate={handleCreateSessionSubmit}
      />
    </AdminLayout>
  );
}
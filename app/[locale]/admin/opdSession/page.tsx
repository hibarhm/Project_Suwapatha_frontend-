
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/adminLayout';
import CreateSessionModal from '@/app/components/CreateSessionModal';
import { adminApi, DoctorAvailability } from '@/app/api/admin/adminApi';
import API_BASE_URL from '@/app/api/api';
import {useTranslations} from 'next-intl';

interface HospitalInfo {
  id: string;
  name: string;
  location: string;
}

interface TodayStats {
  totalPatients: number;
  allocatedPatients: number;
  unallocatedPatients: number;
  activeDoctors: number;
  totalDoctors: number;
  activeSessions: number;
}

interface Session {
  id: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  startTime: string;
  endTime: string;
  department: string;
  doctorName: string;
  room: string;
  maxQueueSize: number;
  currentQueueCount: number;
  availableSlots: number;
  status: string;
}

export default function OPDSessionManagement() {
  const t = useTranslations('adminOpdSessionPage');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('today');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for real data
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo>({
    name: t('loadingShort'),
    location: t('loadingShort'),
    id: ''
  });
  const [todayStats, setTodayStats] = useState<TodayStats>({
    totalPatients: 0,
    allocatedPatients: 0,
    unallocatedPatients: 0,
    activeDoctors: 0,
    totalDoctors: 0,
    activeSessions: 0
  });
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [scheduledSessions, setScheduledSessions] = useState<Session[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<DoctorAvailability[]>([]);
  const [selectedSessionPatients, setSelectedSessionPatients] = useState<any[]>([]);
  const [viewingPatientsFor, setViewingPatientsFor] = useState<string | null>(null);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [allocatingSessionId, setAllocatingSessionId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    totalSlots: 30,
    slotDuration: 15
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'today') {
      fetchTodayData();
    } else {
      fetchUpcomingData();
    }
  }, [activeTab]);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchHospitalInfo(),
        fetchRooms(),
        fetchTodayData(),
        fetchAvailableDoctors()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(t('errors.loadData'));
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
    } catch (err) {
      console.error('Error fetching today sessions:', err);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/opd/sessions/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.fetchUpcomingSessions'));
      }

      const data = await response.json();
      setScheduledSessions(data);
    } catch (err) {
      console.error('Error fetching upcoming sessions:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/opd/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.fetchRooms'));
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
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

  const handleUpdateDoctorRoom = async (availabilityId: string, room: string) => {
    try {
      await adminApi.assignDoctorRoom(availabilityId, room);
      await fetchAvailableDoctors();
      alert(t('alerts.roomAssigned'));
    } catch (err: any) {
      alert(err.message || t('errors.assignRoom'));
    }
  };

  const handleAllocatePatients = async (sessionId: string) => {
    setAllocatingSessionId(sessionId);
    try {
      await adminApi.allocatePatients(sessionId);
      await fetchTodaySessions();
      alert(t('alerts.patientsAllocated'));
    } catch (err: any) {
      alert(err.message || t('errors.allocatePatients'));
    } finally {
      setAllocatingSessionId(null);
    }
  };

  const fetchTodayData = async () => {
    await Promise.all([
      fetchTodayStats(),
      fetchTodaySessions()
    ]);
  };

  const fetchUpcomingData = async () => {
    await fetchUpcomingSessions();
  };

  const handleCreateSession = async () => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          startTime: '08:00',
          endTime: '12:00',
          department: 'General Consultation',
          doctorName: t('labels.pendingAssignment'),
          room: t('labels.notAssigned'),
          maxQueueSize: formData.totalSlots,
          slotDuration: formData.slotDuration
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('errors.createSession'));
      }

      // Refresh data
      await fetchUpcomingData();

      setShowCreateModal(false);
      setFormData({
        date: '',
        totalSlots: 30,
        slotDuration: 15
      });

      alert(t('alerts.sessionCreated'));
    } catch (err: any) {
      console.error('Error creating session:', err);
      alert(err.message || t('errors.createSession'));
    }
  };

  const handleAssignRoom = async (sessionId: string, room: string) => {
    if (!room) return;

    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/sessions/${sessionId}/assign-room`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('errors.assignRoom'));
      }

      // Refresh data
      await fetchTodaySessions();

      alert(t('alerts.roomAssigned'));
    } catch (err: any) {
      console.error('Error assigning room:', err);
      alert(err.message || t('errors.assignRoom'));
    }
  };

  const handleUpdateSession = async (sessionId: string, updates: any) => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('errors.updateSession'));
      }

      // Refresh data
      await fetchTodaySessions();

      alert(t('alerts.sessionUpdated'));
    } catch (err: any) {
      console.error('Error updating session:', err);
      alert(err.message || t('errors.updateSession'));
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm(t('confirm.cancelSession'))) {
      return;
    }

    try {
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('errors.cancelSession'));
      }

      // Refresh data
      if (activeTab === 'today') {
        await fetchTodayData();
      } else {
        await fetchUpcomingData();
      }

      alert(t('alerts.sessionCancelled'));
    } catch (err: any) {
      console.error('Error cancelling session:', err);
      alert(err.message || t('errors.cancelSession'));
    }
  };

  const fetchSessionPatients = async (sessionId: string) => {
    setLoadingPatients(true);
    setViewingPatientsFor(sessionId);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/sessions/${sessionId}/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(t('errors.fetchPatients'));
      }

      const data = await response.json();
      setSelectedSessionPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(t('errors.loadPatientList'));
    } finally {
      setLoadingPatients(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-sm text-gray-600 mt-1">{hospitalInfo.name}, {hospitalInfo.location}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('actions.createNewSession')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">{t('stats.totalPatientsToday')}</p>
            <p className="text-3xl font-bold text-[#94B4C1]">{todayStats.totalPatients}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">{t('stats.allocated')}</p>
            <p className="text-3xl font-bold text-green-600">{todayStats.allocatedPatients}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">{t('stats.unallocated')}</p>
            <p className="text-3xl font-bold text-orange-600">{todayStats.unallocatedPatients}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">{t('stats.activeDoctors')}</p>
            <p className="text-3xl font-bold text-blue-600">{todayStats.activeDoctors}/{todayStats.totalDoctors}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'today'
              ? 'border-[#94B4C1] text-[#94B4C1]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {t('tabs.todaySessions')}
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
              {todayStats.activeSessions}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'upcoming'
              ? 'border-[#94B4C1] text-[#94B4C1]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {t('tabs.upcomingSessions')}
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {scheduledSessions.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Room Assignment for Doctors */}
      {activeTab === 'today' && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t('availableDoctors.title')}</h2>
            <button
              onClick={fetchAvailableDoctors}
              className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium"
            >
              {t('actions.refreshDoctors')}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-6">{t('availableDoctors.subtitle')}</p>

          {availableDoctors.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500 italic">{t('availableDoctors.empty')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDoctors.map((doc) => (
                <div key={doc.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#94B4C1]/20 rounded-full flex items-center justify-center text-[#94B4C1] font-bold">
                      {doc.doctorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{doc.doctorName}</h4>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{doc.email}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">{t('labels.assignedRoom')}</label>
                    <div className="flex gap-2">
                      <select
                        value={doc.room || ''}
                        onChange={(e) => handleUpdateDoctorRoom(doc.id, e.target.value)}
                        className="flex-1 text-sm border border-gray-200 rounded px-2 py-1.5 focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]"
                      >
                        <option value="">{t('labels.notAssigned')}</option>
                        {rooms.map(room => (
                          <option key={room} value={room}>{room}</option>
                        ))}
                      </select>
                      {doc.room && (
                        <span className="flex items-center justify-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TODAY'S SESSIONS TAB */}
      {activeTab === 'today' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Active Sessions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('todaySessions.title')}</h2>
                <button
                  onClick={fetchTodaySessions}
                  className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium"
                >
                  {t('common.refresh')}
                </button>
              </div>

              {todaySessions.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('todaySessions.emptyTitle')}</h3>
                  <p className="text-gray-600 mb-4">{t('todaySessions.emptySubtitle')}</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors font-medium"
                  >
                    {t('todaySessions.createFirst')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaySessions.map((session) => (
                    <div key={session.id} className={`border-2 rounded-lg p-4 ${
                      session.status === 'OPEN' ? 'border-green-200 bg-green-50' : 
                      session.status === 'COMPLETED' ? 'border-blue-200 bg-blue-50/30' : 
                      'border-gray-200'
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{session.doctorName}</h3>
                            {session.status === 'OPEN' && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {t('common.active')}
                              </span>
                            )}
                            {session.status === 'COMPLETED' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                {t('common.completed')}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">{t('labels.time')}</p>
                              <p className="font-medium text-gray-900">{session.startTime} - {session.endTime}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">{t('labels.room')}</p>
                              <div className="flex items-center gap-2">
                                <p className={`font-medium ${session.room === t('labels.notAssigned') ? 'text-red-600' : 'text-gray-900'}`}>
                                  {session.room}
                                </p>
                                {session.room === t('labels.notAssigned') && (
                                  <select
                                    onChange={(e) => handleAssignRoom(session.id, e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]"
                                  >
                                    <option value="">{t('labels.assign')}</option>
                                    {rooms.map(room => (
                                      <option key={room} value={room}>{room}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600">{t('labels.patients')}</p>
                              <p className="font-medium text-gray-900">
                                {session.currentQueueCount}/{session.maxQueueSize}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              onClick={() => fetchSessionPatients(session.id)}
                              className="px-4 py-1.5 text-sm font-medium text-[#94B4C1] border border-[#94B4C1] rounded-lg hover:bg-[#94B4C1] hover:text-white transition-colors"
                            >
                              {t('actions.viewPatients')}
                            </button>

                            {session.status === 'OPEN' && session.currentQueueCount > 0 && (
                              <button
                                onClick={() => handleAllocatePatients(session.id)}
                                disabled={allocatingSessionId === session.id}
                                className={`px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${allocatingSessionId === session.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                  }`}
                              >
                                {allocatingSessionId === session.id ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {t('actions.allocating')}
                                  </>
                                ) : (
                                  t('actions.allocatePatients')
                                )}
                              </button>
                            )}

                            {session.status === 'OPEN' && (
                              <button
                                onClick={() => handleCancelSession(session.id)}
                                className="px-4 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                {t('actions.cancelSession')}
                              </button>
                            )}
                          </div>

                          {/* Patient List Section */}
                          {viewingPatientsFor === session.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <h4 className="text-sm font-bold text-gray-900 mb-3">{t('patientList.title')}</h4>
                              {loadingPatients ? (
                                <p className="text-sm text-gray-600">{t('patientList.loading')}</p>
                              ) : selectedSessionPatients.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">{t('patientList.empty')}</p>
                              ) : (
                                <div className="space-y-2">
                                  {selectedSessionPatients.map((apt) => (
                                    <div key={apt.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 text-sm">
                                      <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 flex items-center justify-center bg-[#94B4C1]/20 text-[#94B4C1] rounded-full text-xs font-bold">
                                          {apt.queueNumber}
                                        </span>
                                        <span className="font-medium text-gray-900">{apt.patientName || t('common.patient')}</span>
                                        <span className="text-gray-500 text-xs">{apt.patientEmail}</span>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apt.status === 'BOOKED' ? 'bg-blue-100 text-blue-700' :
                                        apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                          'bg-gray-100 text-gray-700'
                                        }`}>
                                        {apt.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('summary.title')}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{t('summary.capacityUsage')}</span>
                    <span className="font-semibold text-gray-900">
                      {todayStats.totalPatients > 0
                        ? Math.round((todayStats.allocatedPatients / todayStats.totalPatients) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#94B4C1] h-3 rounded-full transition-all"
                      style={{
                        width: `${todayStats.totalPatients > 0
                          ? (todayStats.allocatedPatients / todayStats.totalPatients) * 100
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3">{t('summary.patientsPerDoctor')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.activeDoctors > 0
                      ? Math.round(todayStats.allocatedPatients / todayStats.activeDoctors)
                      : 0}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3">{t('summary.activeSessions')}</p>
                  <p className="text-2xl font-bold text-green-600">{todayStats.activeSessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#94B4C1]/10 to-[#A1C2BD]/10 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-gray-900">{t('quickActions.title')}</h3>
              <p className="text-sm text-gray-700 mb-4">{t('quickActions.subtitle')}</p>
              <div className="space-y-2">
                <button
                  onClick={fetchTodayData}
                  className="w-full bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  {t('quickActions.refreshData')}
                </button>
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="w-full bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  {t('quickActions.viewDashboard')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPCOMING SESSIONS TAB */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          <div className="bg-[#94B4C1]/5 border border-[#94B4C1]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#94B4C1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-[#94B4C1]">{t('upcoming.bookableTitle')}</p>
                <p className="text-xs text-gray-700 mt-1">
                  {t('upcoming.bookableSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {scheduledSessions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('upcoming.emptyTitle')}</h3>
              <p className="text-gray-600 mb-4">{t('upcoming.emptySubtitle')}</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors font-medium"
              >
                {t('actions.createNewSession')}
              </button>
            </div>
          ) : (
            scheduledSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#94B4C1]/10 text-[#94B4C1] text-xs font-semibold rounded-full">
                        {session.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">{t('labels.date')}</p>
                        <p className="font-semibold text-gray-900">{session.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('labels.time')}</p>
                        <p className="font-semibold text-gray-900">{session.startTime} - {session.endTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('labels.bookingStatus')}</p>
                        <p className="font-semibold text-gray-900">
                          {t('labels.slotsCount', {current: session.currentQueueCount, max: session.maxQueueSize})}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-[#94B4C1] h-2 rounded-full"
                            style={{
                              width: `${session.maxQueueSize
                                ? (session.currentQueueCount / session.maxQueueSize) * 100
                                : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('labels.doctor')}</p>
                        <p className="font-medium text-gray-900">{session.doctorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('labels.room')}</p>
                        <p className="font-medium text-gray-900">{session.room}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchSessionPatients(session.id)}
                        className="px-4 py-2 border border-[#94B4C1] text-[#94B4C1] rounded-lg hover:bg-[#94B4C1] hover:text-white text-sm font-medium transition-colors"
                      >
                        {t('actions.viewPatients')}
                      </button>
                      <button
                        onClick={() => {
                          // You can implement edit functionality here
                          alert(t('alerts.editComingSoon'));
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] text-sm font-medium transition-colors"
                      >
                        {t('actions.edit')}
                      </button>
                      <button
                        onClick={() => handleCancelSession(session.id)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"
                      >
                        {t('actions.cancel')}
                      </button>
                    </div>

                    {/* Patient List Section */}
                    {viewingPatientsFor === session.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">{t('patientList.title')}</h4>
                        {loadingPatients ? (
                          <p className="text-sm text-gray-600">{t('patientList.loading')}</p>
                        ) : selectedSessionPatients.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">{t('patientList.empty')}</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedSessionPatients.map((apt) => (
                              <div key={apt.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100 text-sm">
                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 flex items-center justify-center bg-[#94B4C1]/20 text-[#94B4C1] rounded-full text-xs font-bold">
                                    {apt.queueNumber}
                                  </span>
                                  <span className="font-medium text-gray-900">{apt.patientName || t('common.patient')}</span>
                                  <span className="text-gray-500 text-xs">{apt.patientEmail}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apt.status === 'BOOKED' ? 'bg-blue-100 text-blue-700' :
                                  apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                  {apt.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        formData={formData}
        setFormData={setFormData}
        onCreate={handleCreateSession}
      />
    </AdminLayout>
  );
}

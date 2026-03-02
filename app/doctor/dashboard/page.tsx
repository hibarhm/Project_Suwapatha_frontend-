'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorLayout from '@/app/components/doctorLayout';

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
  createdAt: string;
  read: boolean;
}

export default function DoctorDashboard() {
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
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchAllData();
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
        setError('Unauthorized: Access restricted to doctors.');
        setLoading(false);
        return;
      }

      await Promise.all([
        fetchProfile(),
        fetchTodayAppointments(),
        fetchUpcomingAppointments(),
        fetchNotifications()
      ]);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      
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

  const fetchTodayAppointments = async () => {
    try {
      const token = getAuthToken();
      
      const response = await fetch('http://localhost:8080/api/doctor/appointments/today', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('Today appointments endpoint not available');
        setTodayAppointments([]);
        return;
      }

      const data = await response.json();
      setTodayAppointments(data);
      
      // Calculate stats from appointments
      calculateStats(data);
    } catch (err) {
      console.error('Error fetching today appointments:', err);
      setTodayAppointments([]);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const token = getAuthToken();
      
      const response = await fetch('http://localhost:8080/api/doctor/appointments/upcoming', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('Upcoming appointments endpoint not available');
        setUpcomingAppointments([]);
        return;
      }

      const data = await response.json();
      setUpcomingAppointments(data);
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      setUpcomingAppointments([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = getAuthToken();
      
      const response = await fetch('http://localhost:8080/api/doctor/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('Notifications endpoint not available');
        setNotifications([]);
        return;
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const token = getAuthToken();
      
      await fetch(`http://localhost:8080/api/doctor/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = getAuthToken();
      
      await fetch(`http://localhost:8080/api/doctor/notifications/${notificationId}`, {
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

  const calculateStats = (appointments: Appointment[]) => {
    const totalToday = appointments.length;
    const avgWait = appointments.length > 0 
      ? Math.round(appointments.reduce((sum, apt) => sum + apt.estimatedWaitMinutes, 0) / appointments.length)
      : 0;

    setStats({
      totalPatientsToday: totalToday,
      consultationsThisWeek: totalToday * 5, // Approximate
      averageWaitTime: avgWait,
      changeFromYesterday: 0, // Would need historical data
      changeFromLastWeek: 0, // Would need historical data
      changeFromLastMonth: 0, // Would need historical data
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchAllData}
              className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  // Sample data for charts (would come from backend in production)
  const patientVisitsData = [
    { month: 'Jan', count: 245 },
    { month: 'Feb', count: 280 },
    { month: 'Mar', count: 265 },
    { month: 'Apr', count: 310 },
    { month: 'May', count: 290 },
    { month: 'Jun', count: 330 }
  ];

  const consultationsByDay = [
    { day: 'Mon', count: 28 },
    { day: 'Tue', count: 32 },
    { day: 'Wed', count: 25 },
    { day: 'Thu', count: 30 },
    { day: 'Fri', count: 35 },
    { day: 'Sat', count: 20 },
    { day: 'Sun', count: 15 }
  ];

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
      case 'alert':
        return (
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

  return (
    <DoctorLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Dr. {profile?.lastName || 'Doctor'}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your patients today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Patients Today */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Patients Today</p>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.totalPatientsToday}</p>
            <p className={`text-sm ${stats.changeFromYesterday >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.changeFromYesterday >= 0 ? '+' : ''}{stats.changeFromYesterday} since yesterday
            </p>
          </div>

          {/* Consultations This Week */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Consultations This Week</p>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.consultationsThisWeek}</p>
            <p className={`text-sm ${stats.changeFromLastWeek >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.changeFromLastWeek >= 0 ? '+' : ''}{stats.changeFromLastWeek}% from last week
            </p>
          </div>

          {/* Average Wait Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Average Wait Time</p>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.averageWaitTime} min</p>
            <p className={`text-sm ${stats.changeFromLastMonth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.changeFromLastMonth >= 0 ? '+' : ''}{stats.changeFromLastMonth} min from last month
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Patient Visits Over Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Patient Visits Over Time</h3>
              <button 
                onClick={fetchAllData}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors"
              >
                Refresh
              </button>
            </div>

            {/* Line Chart */}
            <div className="h-64">
              <svg className="w-full h-full" viewBox="0 0 600 250">
                {/* Grid lines */}
                <line x1="50" y1="200" x2="550" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="150" x2="550" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="100" x2="550" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="50" y1="50" x2="550" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                {/* Line */}
                <polyline
                  points="80,120 160,90 240,110 320,60 400,80 480,40"
                  fill="none"
                  stroke="#94B4C1"
                  strokeWidth="3"
                />
                {/* Y-axis labels */}
                <text x="20" y="55" fontSize="12" fill="#6b7280">350</text>
                <text x="20" y="105" fontSize="12" fill="#6b7280">300</text>
                <text x="20" y="155" fontSize="12" fill="#6b7280">250</text>
                <text x="20" y="205" fontSize="12" fill="#6b7280">200</text>
                {/* X-axis labels */}
                {patientVisitsData.map((data, i) => (
                  <text key={i} x={70 + i * 80} y="225" fontSize="12" fill="#6b7280">{data.month}</text>
                ))}
              </svg>
            </div>
          </div>

          {/* Consultations by Day */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Consultations by Day</h3>
              <button 
                onClick={fetchAllData}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors"
              >
                Refresh
              </button>
            </div>

            {/* Bar Chart */}
            <div className="h-64 flex items-end justify-around gap-3 px-4">
              {consultationsByDay.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#94B4C1] rounded-t transition-all hover:bg-[#7fa8b8] cursor-pointer"
                    style={{ height: `${(day.count / 35) * 100}%` }}
                    title={`${day.count} consultations`}
                  ></div>
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments and Notifications */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Today's Appointments</h3>
              <button 
                onClick={fetchTodayAppointments}
                className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium"
              >
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-600">Patient Name</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-600">Queue No.</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-600">Hospital</th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-right py-3 px-3 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#A1C2BD] flex items-center justify-center text-white text-xs font-semibold">
                              {appointment.patientName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{appointment.patientName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-sm text-gray-900">#{appointment.queueNumber}</td>
                        <td className="py-4 px-3 text-sm text-gray-600">{appointment.hospitalName}</td>
                        <td className="py-4 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            appointment.status === 'BOOKED' 
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/doctor/consultation/${appointment.id}`)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="Start Consultation"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button 
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="View Details"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm font-medium">No appointments for today</p>
                        <p className="text-gray-400 text-xs mt-1">Your schedule is clear</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifications & Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <button 
                  onClick={fetchNotifications}
                  className="text-sm text-[#94B4C1] hover:text-[#7fa8b8] font-medium"
                >
                  Refresh
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex gap-3 p-3 rounded-lg border transition-colors ${
                      notification.read 
                        ? 'border-gray-100 bg-gray-50' 
                        : 'border-[#94B4C1]/20 bg-[#94B4C1]/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'appointment' 
                        ? 'bg-[#94B4C1]/10' 
                        : notification.type === 'message'
                        ? 'bg-blue-100'
                        : 'bg-amber-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm mb-1 ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 hover:bg-gray-200 rounded flex-shrink-0 h-6"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-gray-500 text-sm font-medium">No notifications</p>
                  <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
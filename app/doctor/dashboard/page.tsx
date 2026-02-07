'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorLayout from '@/app/components/doctorLayout';

export default function DoctorDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data (unchanged)
  const stats = {
    totalPatientsToday: 35,
    consultationsThisWeek: 128,
    averageWaitTime: 15,
    changeFromYesterday: 5,
    changeFromLastWeek: 12,
    changeFromLastMonth: -2
  };

  const upcomingAppointments = [
    { id: 1, patientName: 'Jane Doe', queueNo: 'Q001', time: '10:00 AM', avatar: 'JD' },
    { id: 2, patientName: 'John Smith', queueNo: 'Q002', time: '10:30 AM', avatar: 'JS' },
    { id: 3, patientName: 'Emily White', queueNo: 'Q003', time: '11:00 AM', avatar: 'EW' },
    { id: 4, patientName: 'Michael Brown', queueNo: 'Q004', time: '11:30 AM', avatar: 'MB' },
    { id: 5, patientName: 'Jessica Lee', queueNo: 'Q005', time: '12:00 PM', avatar: 'JL' }
  ];

  const notifications = [
    { id: 1, type: 'message', title: 'New message from Jane Doe regarding lab results.', time: 'Just now', icon: 'mail' },
    { id: 2, type: 'cancelled', title: 'Appointment with John Smith cancelled at 10:30 AM.', time: '2 hours ago', icon: 'calendar' },
    { id: 3, type: 'lab', title: 'Lab results for Emily White are ready for review.', time: '3 hours ago', icon: 'flask' },
    { id: 4, type: 'reminder', title: 'Reminder: Follow-up with Michael Brown scheduled for tomorrow.', time: 'Yesterday', icon: 'mail' }
  ];

  const patientVisitsData = [
    { month: 'Jan', visits: 190 },
    { month: 'Feb', visits: 230 },
    { month: 'Mar', visits: 210 },
    { month: 'Apr', visits: 280 },
    { month: 'May', visits: 250 },
    { month: 'Jun', visits: 310 }
  ];

  const consultationsByDay = [
    { day: 'Mon', count: 18 },
    { day: 'Tue', count: 24 },
    { day: 'Wed', count: 21 },
    { day: 'Thu', count: 32 },
    { day: 'Fri', count: 23 },
    { day: 'Sat', count: 15 },
    { day: 'Sun', count: 10 }
  ];

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <DoctorLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Patients Today */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Patients Today</p>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.totalPatientsToday}</p>
          <p className="text-sm text-green-600">+{stats.changeFromYesterday} since yesterday</p>
        </div>

        {/* Consultations This Week */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Consultations This Week</p>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.consultationsThisWeek}</p>
          <p className="text-sm text-green-600">+{stats.changeFromLastWeek}% from last week</p>
        </div>

        {/* Average Wait Time */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Average Wait Time</p>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-[#94B4C1] mb-2">{stats.averageWaitTime} min</p>
          <p className="text-sm text-green-600">{stats.changeFromLastMonth} min from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Patient Visits Over Time */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Patient Visits Over Time</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors">
                Export Data
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors">
                Detailed Reports
              </button>
            </div>
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
              <text x="20" y="55" fontSize="12" fill="#6b7280">300</text>
              <text x="20" y="105" fontSize="12" fill="#6b7280">270</text>
              <text x="20" y="155" fontSize="12" fill="#6b7280">240</text>
              <text x="20" y="205" fontSize="12" fill="#6b7280">210</text>
              {/* X-axis labels */}
              <text x="70" y="225" fontSize="12" fill="#6b7280">Jan</text>
              <text x="150" y="225" fontSize="12" fill="#6b7280">Feb</text>
              <text x="230" y="225" fontSize="12" fill="#6b7280">Mar</text>
              <text x="310" y="225" fontSize="12" fill="#6b7280">Apr</text>
              <text x="390" y="225" fontSize="12" fill="#6b7280">May</text>
              <text x="470" y="225" fontSize="12" fill="#6b7280">Jun</text>
            </svg>
          </div>
        </div>

        {/* Consultations by Day */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Consultations by Day</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors">
                Export Data
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors">
                Detailed Reports
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-around gap-3 px-4">
            {consultationsByDay.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#94B4C1] rounded-t transition-all hover:bg-[#7fa8b8]"
                  style={{ height: `${(day.count / 32) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-600">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Upcoming Appointments</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-sm font-semibold text-gray-600">Patient Name</th>
                  <th className="text-left py-3 px-3 text-sm font-semibold text-gray-600">Queue No.</th>
                  <th className="text-left py-3 px-3 text-sm font-semibold text-gray-600">Time</th>
                  <th className="text-right py-3 px-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#A1C2BD] flex items-center justify-center text-white text-xs font-semibold">
                          {appointment.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{appointment.patientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-sm text-gray-900">{appointment.queueNo}</td>
                    <td className="py-4 px-3 text-sm text-gray-900">{appointment.time}</td>
                    <td className="py-4 px-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Notifications & Alerts</h3>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'message' ? 'bg-[#94B4C1]/10' :
                  notification.type === 'cancelled' ? 'bg-purple-100' :
                  notification.type === 'lab' ? 'bg-[#94B4C1]/10' :
                  'bg-[#94B4C1]/10'
                }`}>
                  {notification.icon === 'mail' && (
                    <svg className="w-4 h-4 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {notification.icon === 'calendar' && (
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {notification.icon === 'flask' && (
                    <svg className="w-4 h-4 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-1">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
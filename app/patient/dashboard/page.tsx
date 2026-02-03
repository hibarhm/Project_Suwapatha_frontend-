'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample data
  const upcomingAppointments = [
    {
      date: 'Wednesday, July 17',
      time: '10:00 AM',
      doctor: 'Dr. Emily White',
      queueNo: 'A15'
    }
  ];

  const notifications = [
    {
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Emily White is coming up.',
      time: '1 hour ago'
    },
    {
      type: 'lab',
      title: 'New Lab Results',
      message: 'Your recent blood test results are available.',
      time: '4 hours ago'
    },
  ];

  const appointmentHistory = [
    { month: 'Jan', visits: 2 },
    { month: 'Feb', visits: 3 },
    { month: 'Mar', visits: 4 },
    { month: 'Apr', visits: 2 },
    { month: 'May', visits: 3 },
    { month: 'Jun', visits: 1 }
  ];

  const handleLogout = () => {
    // Clear any authentication tokens/session data here
    // localStorage.removeItem('authToken');
    // sessionStorage.clear();
    
    // Redirect to homepage
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-indigo-700 whitespace-nowrap">Suwapatha</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/patient/dashboard">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="whitespace-nowrap">Dashboard</span>
            </button>
          </Link>

          <Link href="/patient/appointments">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'bg-indigo-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="whitespace-nowrap">Appointments</span>
            </button>
          </Link>

          <Link href="/patient/records">
            <button
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'records'
                  ? 'bg-indigo-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="whitespace-nowrap">Medical Records</span>
            </button>
          </Link>

          <Link href="/patient/settings">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-indigo-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="whitespace-nowrap">Settings</span>
            </button>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="whitespace-nowrap">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                  <p className="text-sm text-gray-600">Your next visits and their details.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Time</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Doctor</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Queue No.</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.map((apt, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-4 px-3 text-sm text-gray-900">{apt.date}</td>
                          <td className="py-4 px-3 text-sm text-gray-900">{apt.time}</td>
                          <td className="py-4 px-3 text-sm text-gray-900">{apt.doctor}</td>
                          <td className="py-4 px-3 text-sm font-semibold text-gray-900">{apt.queueNo}</td>
                          <td className="py-4 px-3">
                            <div className="flex gap-2">
                              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 whitespace-nowrap">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Reschedule
                              </button>
                              <button className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-1 whitespace-nowrap">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>

              {/* Medical Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Medical Summary</h2>
                  <p className="text-sm text-gray-600">An overview of your recent health information.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Last Visit Date:</p>
                    <p className="text-base font-semibold text-gray-900">July 10, 2024</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Latest Diagnosis:</p>
                    <p className="text-base font-semibold text-gray-900">Seasonal Allergy (Controlled)</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Current Medications:</p>
                  <p className="text-sm text-gray-900">Loratadine (10mg, daily), Vitamin D3 (1000IU, daily)</p>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Allergies:</p>
                  <p className="text-sm text-gray-900">Pollen, Dust Mites</p>
                </div>

                <Link href="/patient/records">
                  <button className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
                    View Full Medical Record →
                  </button>
                </Link>
              </div>

              {/* Vitals Trend */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Vitals Trend</h2>
                  <p className="text-sm text-gray-600">Blood pressure and heart rate over the last 6 months.</p>
                </div>

                {/* Simple Chart Representation */}
                <div className="h-64 relative">
                  <svg className="w-full h-full" viewBox="0 0 700 250">
                    {/* Grid lines */}
                    <line x1="50" y1="200" x2="650" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="150" x2="650" y2="150" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="100" x2="650" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="50" x2="650" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                    
                    {/* Systolic BP (Blue) */}
                    <polyline
                      points="100,60 200,55 300,58 400,56 500,57 600,60"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                    />
                    
                    {/* Diastolic BP (Red) */}
                    <polyline
                      points="100,130 200,128 300,132 400,130 500,131 600,133"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    
                    {/* Heart Rate (Cyan) */}
                    <polyline
                      points="100,145 200,142 300,147 400,144 500,146 600,148"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                    />

                    {/* Y-axis labels */}
                    <text x="25" y="55" fontSize="12" fill="#6b7280">140</text>
                    <text x="25" y="105" fontSize="12" fill="#6b7280">105</text>
                    <text x="35" y="155" fontSize="12" fill="#6b7280">70</text>
                    <text x="35" y="205" fontSize="12" fill="#6b7280">35</text>

                    {/* X-axis labels */}
                    <text x="85" y="225" fontSize="12" fill="#6b7280">Jan</text>
                    <text x="185" y="225" fontSize="12" fill="#6b7280">Feb</text>
                    <text x="285" y="225" fontSize="12" fill="#6b7280">Mar</text>
                    <text x="385" y="225" fontSize="12" fill="#6b7280">Apr</text>
                    <text x="485" y="225" fontSize="12" fill="#6b7280">May</text>
                    <text x="585" y="225" fontSize="12" fill="#6b7280">Jun</text>
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-xs text-gray-600">Systolic BP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">Diastolic BP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-xs text-gray-600">Heart Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                </div>
                <p className="text-xs text-gray-600 mb-4">Important updates and reminders.</p>

                <div className="space-y-4">
                  {notifications.map((notif, index) => (
                    <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          notif.type === 'appointment' ? 'bg-indigo-100' :
                          notif.type === 'lab' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            notif.type === 'appointment' ? 'text-indigo-600' :
                            notif.type === 'lab' ? 'text-blue-600' :
                            'text-purple-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {notif.type === 'appointment' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            )}
                            {notif.type === 'lab' && (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            )}
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="text-sm font-medium text-indigo-700 hover:text-indigo-800 mt-4">
                  View All →
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Actions</h3>
                <p className="text-xs text-gray-600 mb-4">Access common tasks instantly.</p>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/patient/appointments">
                    <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors w-full">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-900">Book Appointment</span>
                    </button>
                  </Link>

                  <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-900">Request Refill</span>
                  </button>

                  <Link href="/patient/records">
                    <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors w-full">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-900">View Records</span>
                    </button>
                  </Link>

                  <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-900">Contact Support</span>
                  </button>
                </div>
              </div>

              {/* Appointment History */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Appointment History</h3>
                <p className="text-xs text-gray-600 mb-4">Total visits over the last 6 months.</p>

                {/* Bar Chart */}
                <div className="h-40 flex items-end justify-around gap-2 px-2">
                  {appointmentHistory.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-indigo-600 rounded-t-lg transition-all hover:bg-indigo-700" style={{ height: `${month.visits * 25}%` }}></div>
                      <span className="text-xs text-gray-600">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
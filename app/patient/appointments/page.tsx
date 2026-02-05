'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PatientLayout from '@/app/components/patientLayout';

export default function AppointmentBookingPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-01-18');

  // Logout handler
  const handleLogout = () => {
    // Add any logout logic here (clear tokens, session storage, etc.)
    router.push('/');
  };

  // Sample medical records data
  const medicalRecords = [
    {
      date: '2023-11-20',
      title: 'Routine Check-up',
      doctor: 'Dr. Kamal Silva',
      notes: 'Blood pressure normal, advised on diet.'
    },
    {
      date: '2023-09-15',
      title: 'Fever & Cold',
      doctor: 'Dr. Priyantha Fernando',
      notes: 'Prescribed antibiotics and rest. Follow-up in 3 days.'
    },
    {
      date: '2023-06-01',
      title: 'Vaccination',
      doctor: 'Dr. Sumudu Kumari',
      notes: 'Annual flu shot administered.'
    },
    {
      date: '2023-03-10',
      title: 'Allergy Consultation',
      doctor: 'Dr. Nilmini Rajapaksha',
      notes: 'Identified dust mite allergy. Prescribed antihistamines.'
    }
  ];

  // Sample notifications
  const notifications = [
    {
      type: 'info',
      title: 'Your turn is approaching!',
      message: 'Estimated 5 minutes remaining.',
      time: 'Just now'
    },
    {
      type: 'reminder',
      title: 'Remember your follow-up',
      message: 'appointment with Dr. Silva tomorrow at 10 AM.',
      time: '1 hour ago'
    },
    {
      type: 'info',
      title: 'Queue number 10 has been called.',
      message: 'Please proceed to Room 2.',
      time: '2 hours ago'
    }
  ];

  return (
    <PatientLayout onLogout={handleLogout}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Booking Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hospital Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Hospital Search</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[#94B4C1] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-[#94B4C1] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for hospitals by name or location..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use my current location
              </button>
            </div>
          </div>

          {/* OPD Booking */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">OPD Booking</h2>
            <div className="space-y-4">
              <div>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-700"
                >
                  <option value="">Select Hospital</option>
                  <option value="general">General Hospital Colombo</option>
                  <option value="national">National Hospital Sri Lanka</option>
                </select>
              </div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-700"
                />
              </div>
              <button className="w-full bg-[#94B4C1] hover:bg-[#7fa8b8] text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Get Queue Number
              </button>
            </div>
          </div>

          {/* My Queue Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Queue Status</h2>
            <div className="bg-gradient-to-br from-gray-50 to-[#94B4C1]/5 rounded-xl p-8 mb-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Queue Number</p>
                <p className="text-6xl font-bold text-[#94B4C1]">15</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Estimated Wait Time
                  </div>
                  <p className="text-base font-semibold text-gray-900">25 min</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Assigned Doctor
                  </div>
                  <p className="text-base font-semibold text-gray-900">Dr. Ayesha Perera</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Consultation Room
                  </div>
                  <p className="text-base font-semibold text-gray-900">OPD Room 3</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#94B4C1]/10 text-[#94B4C1]">
                    Waiting
                  </span>
                </div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-[#94B4C1] hover:bg-[#7fa8b8] text-white font-medium py-3 px-6 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Appointment
            </button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* My e-Medical Book */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">My e-Medical Book</h3>
            <div className="space-y-4 mb-4">
              {medicalRecords.map((record, index) => (
                <div key={index} className="border-l-4 border-[#94B4C1] pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#94B4C1]/10 text-[#94B4C1]">
                      {record.date}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{record.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {record.doctor}
                  </div>
                  <p className="text-xs text-gray-600">{record.notes}</p>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      notif.type === 'info' ? 'bg-[#94B4C1]/10' : 'bg-orange-100'
                    }`}>
                      <svg className={`w-4 h-4 ${
                        notif.type === 'info' ? 'text-[#94B4C1]' : 'text-orange-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {notif.type === 'info' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        )}
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">{notif.message}</p>
                    <p className="text-xs text-gray-400">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
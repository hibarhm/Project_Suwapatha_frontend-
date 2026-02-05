'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/adminLayout';
import CreateSessionModal from '@/app/components/CreateSessionModal';

export default function OPDSessionManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'upcoming'
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Logout handler
  const handleLogout = () => {
    router.push('/');
  };

  // Hospital info
  const hospitalInfo = {
    name: 'City General Hospital',
    location: 'Colombo'
  };

  // Today's stats
  const todayStats = {
    totalPatients: 45,
    allocatedPatients: 28,
    unallocatedPatients: 17,
    activeDoctors: 3,
    totalDoctors: 5,
    activeSessions: 2
  };

  // Form state for creating sessions
  const [formData, setFormData] = useState({
    date: '',
    totalSlots: 30,
    slotDuration: 15 // minutes per patient
  });

  // Rooms
  const rooms = [
    'OPD Room 1', 'OPD Room 2', 'OPD Room 3', 'OPD Room 4',
    'OPD Room 5', 'OPD Room 6', 'OPD Room 7', 'OPD Room 8'
  ];

  // Scheduled sessions (next 7 days – bookable)
  const [scheduledSessions, setScheduledSessions] = useState([
    {
      id: 1,
      date: '2026-02-06',
      time: '08:00 - 12:00',
      totalSlots: 30,
      bookedSlots: 15,
      status: 'scheduled'
    },
    {
      id: 2,
      date: '2026-02-07',
      time: '08:00 - 12:00',
      totalSlots: 30,
      bookedSlots: 8,
      status: 'scheduled'
    },
    {
      id: 3,
      date: '2026-02-08',
      time: '08:00 - 12:00',
      totalSlots: 30,
      bookedSlots: 12,
      status: 'scheduled'
    }
  ]);

  // Today's sessions
  const [todaySessions, setTodaySessions] = useState([
    {
      id: 101,
      date: '2026-02-05',
      doctor: 'Dr. Emily White',
      room: 'OPD Room 3',
      time: '08:00 - 12:00',
      status: 'active',
      allocatedPatients: 18,
      currentQueue: 'Q12',
      doctorAvailable: true
    },
    {
      id: 102,
      date: '2026-02-05',
      doctor: 'Dr. Michael Green',
      room: 'OPD Room 5',
      time: '08:00 - 12:00',
      status: 'active',
      allocatedPatients: 10,
      currentQueue: 'Q5',
      doctorAvailable: true
    },
    {
      id: 103,
      date: '2026-02-05',
      doctor: 'Dr. John Davis',
      room: 'Not Assigned',
      time: '08:00 - 12:00',
      status: 'scheduled',
      allocatedPatients: 0,
      currentQueue: '-',
      doctorAvailable: false
    }
  ]);

  // Unallocated patients for today
  const [unallocatedPatients, setUnallocatedPatients] = useState([
    { id: 1, name: 'Amara Fernando', queueNo: 'Q15', time: '09:30', reason: 'General Consultation' },
    { id: 2, name: 'Nimal Perera', queueNo: 'Q16', time: '10:00', reason: 'Follow-up' },
    { id: 3, name: 'Sithara Silva', queueNo: 'Q17', time: '10:30', reason: 'Check-up' },
    { id: 4, name: 'Kamal Wickramasinghe', queueNo: 'Q18', time: '11:00', reason: 'Prescription Renewal' },
    { id: 5, name: 'Dilani Rajapaksha', queueNo: 'Q19', time: '11:30', reason: 'Consultation' },
    { id: 6, name: 'Ruwan Gunasekara', queueNo: 'Q20', time: '11:45', reason: 'Health Check' },
    { id: 7, name: 'Priya Jayawardena', queueNo: 'Q21', time: '09:45', reason: 'Follow-up' },
    { id: 8, name: 'Mahesh Fernando', queueNo: 'Q22', time: '10:15', reason: 'General Consultation' },
    { id: 9, name: 'Sanduni Wijesinghe', queueNo: 'Q23', time: '10:45', reason: 'Check-up' },
    { id: 10, name: 'Tharindu Perera', queueNo: 'Q24', time: '11:15', reason: 'Consultation' },
    { id: 11, name: 'Chamari Silva', queueNo: 'Q25', time: '09:15', reason: 'Follow-up' },
    { id: 12, name: 'Buddhika Rajapaksha', queueNo: 'Q26', time: '10:00', reason: 'Health Check' },
    { id: 13, name: 'Ishara Gunasekara', queueNo: 'Q27', time: '11:00', reason: 'Prescription' },
    { id: 14, name: 'Nadeesha Fernando', queueNo: 'Q28', time: '11:30', reason: 'Check-up' },
    { id: 15, name: 'Gayan Wijeratne', queueNo: 'Q29', time: '10:30', reason: 'Consultation' },
    { id: 16, name: 'Hiruni Perera', queueNo: 'Q30', time: '09:00', reason: 'Follow-up' },
    { id: 17, name: 'Dasun Silva', queueNo: 'Q31', time: '11:45', reason: 'General Check' }
  ]);

  const handleCreateSession = () => {
    console.log('Creating new session:', {
      ...formData,
      time: '08:00 - 12:00'
    });
    // In real implementation you would:
    // - add to scheduledSessions
    // - or send to API
    setShowCreateModal(false);
    setFormData({
      date: '',
      totalSlots: 30,
      slotDuration: 15
    });
  };

  const handleAutoAllocate = () => {
    const availableDoctors = todaySessions.filter(s => s.doctorAvailable && s.room !== 'Not Assigned');
    if (availableDoctors.length === 0) {
      alert('No available doctors! Please assign rooms and mark doctors as available first.');
      return;
    }
    const patientsPerDoctor = Math.ceil(unallocatedPatients.length / availableDoctors.length);
    alert(`Auto-allocating ${unallocatedPatients.length} patients to ${availableDoctors.length} doctors (${patientsPerDoctor} patients per doctor)`);
    setUnallocatedPatients([]);
  };

  const handleManualAllocate = (patientId: number, sessionId: number) => {
    console.log(`Allocating patient ${patientId} to session ${sessionId}`);
    setUnallocatedPatients(unallocatedPatients.filter(p => p.id !== patientId));
  };

  const handleAssignRoom = (sessionId: number, room: string) => {
    setTodaySessions(todaySessions.map(s =>
      s.id === sessionId ? { ...s, room, status: 'active' } : s
    ));
  };

  const toggleDoctorAvailability = (sessionId: number) => {
    setTodaySessions(todaySessions.map(s =>
      s.id === sessionId ? { ...s, doctorAvailable: !s.doctorAvailable } : s
    ));
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">OPD Session Management</h1>
            <p className="text-sm text-gray-600 mt-1">{hospitalInfo.name}, {hospitalInfo.location}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Session
          </button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Total Patients Today</p>
            <p className="text-3xl font-bold text-[#94B4C1]">{todayStats.totalPatients}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Allocated</p>
            <p className="text-3xl font-bold text-green-600">{todayStats.allocatedPatients}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Unallocated</p>
            <p className="text-3xl font-bold text-orange-600">{todayStats.unallocatedPatients}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Active Doctors</p>
            <p className="text-3xl font-bold text-blue-600">{todayStats.activeDoctors}/{todayStats.totalDoctors}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'today'
                ? 'border-[#94B4C1] text-[#94B4C1]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Today's Sessions
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
              {todayStats.activeSessions}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'upcoming'
                ? 'border-[#94B4C1] text-[#94B4C1]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Sessions (Next 7 Days)
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
              {scheduledSessions.length}
            </span>
          </button>
        </nav>
      </div>

      {/* TODAY'S SESSIONS TAB */}
      {activeTab === 'today' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Active Sessions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Today's OPD Sessions</h2>
              <div className="space-y-4">
                {todaySessions.map((session) => (
                  <div key={session.id} className={`border-2 rounded-lg p-4 ${
                    session.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{session.doctor}</h3>
                          {session.status === 'active' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Active
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="font-medium text-gray-900">{session.time}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Room</p>
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${session.room === 'Not Assigned' ? 'text-red-600' : 'text-gray-900'}`}>
                                {session.room}
                              </p>
                              {session.room === 'Not Assigned' && (
                                <select
                                  onChange={(e) => handleAssignRoom(session.id, e.target.value)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]"
                                >
                                  <option value="">Assign</option>
                                  {rooms.map(room => (
                                    <option key={room} value={room}>{room}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600">Patients</p>
                            <p className="font-medium text-gray-900">
                              {session.allocatedPatients}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDoctorAvailability(session.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          session.doctorAvailable ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                        disabled={session.room === 'Not Assigned'}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          session.doctorAvailable ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    {session.status === 'active' && (
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-600">Current Queue:</span>
                        <span className="text-sm font-bold text-[#94B4C1]">{session.currentQueue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Unallocated Patients */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Unallocated Patients</h2>
                  <p className="text-sm text-gray-600">Patients waiting to be assigned to doctors</p>
                </div>
                <button
                  onClick={handleAutoAllocate}
                  className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] font-medium text-sm transition-colors"
                >
                  Auto-Allocate All
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unallocatedPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#94B4C1] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-700">{patient.queueNo}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-600">{patient.reason} • {patient.time}</p>
                      </div>
                    </div>
                    <select
                      onChange={(e) => handleManualAllocate(patient.id, parseInt(e.target.value))}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]"
                    >
                      <option value="">Assign</option>
                      {todaySessions.filter(s => s.doctorAvailable && s.room !== 'Not Assigned').map(session => (
                        <option key={session.id} value={session.id}>
                          {session.doctor} ({session.allocatedPatients} pts)
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {unallocatedPatients.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">All patients allocated!</p>
                    <p className="text-xs text-gray-600">All patients have been assigned to doctors</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Allocation Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Allocation Progress</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round((todayStats.allocatedPatients / todayStats.totalPatients) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#94B4C1] h-3 rounded-full transition-all"
                      style={{ width: `${(todayStats.allocatedPatients / todayStats.totalPatients) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3">Patients per Doctor (Avg)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(todayStats.allocatedPatients / todayStats.activeDoctors)}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-3">Active Sessions</p>
                  <p className="text-2xl font-bold text-green-600">{todayStats.activeSessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#94B4C1]/10 to-[#A1C2BD]/10 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-700 mb-4">Manage today's operations</p>
              <div className="space-y-2">
                <button className="w-full bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">
                  Notify All Patients
                </button>
                <button className="w-full bg-white bg-opacity-60 hover:bg-opacity-80 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">
                  Generate Report
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
                <p className="text-sm font-semibold text-[#94B4C1]">Upcoming Sessions (Bookable)</p>
                <p className="text-xs text-gray-700 mt-1">
                  All sessions run daily from 08:00 to 12:00. Doctors and rooms will be assigned on the day of the session.
                </p>
              </div>
            </div>
          </div>

          {scheduledSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-[#94B4C1]/10 text-[#94B4C1] text-xs font-semibold rounded-full">
                      Scheduled
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">{session.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-900">{session.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booking Status</p>
                      <p className="font-semibold text-gray-900">{session.bookedSlots}/{session.totalSlots} slots</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-[#94B4C1] h-2 rounded-full"
                          style={{ width: `${(session.bookedSlots / session.totalSlots) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
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
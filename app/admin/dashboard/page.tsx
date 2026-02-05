'use client';

import { useState } from 'react';
import AdminLayout from '@/app/components/adminLayout'; // Adjust path if needed

export default function AdminDashboard() {
  const [autoAssignment, setAutoAssignment] = useState(true);
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([0]);

  // Stats data – unchanged
  const stats = [
    { title: 'Total Patients Today', value: '250', change: '+5% from yesterday', icon: '👥', color: 'indigo' },
    { title: 'Active Queues', value: '8', change: '3 in progress', icon: '📋', color: 'orange' },
    { title: 'Avg. Waiting Time', value: '45 min', change: 'Last 24 hours', icon: '⏱️', color: 'gray' },
    { title: 'Doctors Available', value: '12', change: 'Currently online', icon: '🩺', color: 'purple' }
  ];

  const alerts = [
    { type: 'warning', title: 'Doctor Absence: Dr. Silva', description: 'Dr. Silva is unavailable for OPD Session 3 today due to an emergency.' },
    { type: 'warning', title: 'High Patient Load: General OPD', description: '' },
    { type: 'info', title: 'New System Update', description: '' }
  ];

  const doctors = [
    { name: 'Dr. Priyantha Fernando', status: 'online', availability: 'available' },
    { name: 'Dr. Anjali Perera', status: 'online', availability: 'available' },
    { name: 'Dr. Nimal Gunawardena', status: 'offline', availability: 'unavailable' },
    { name: 'Dr. Saman Wijesinghe', status: 'online', availability: 'available' },
    { name: 'Dr. Kamani', status: 'online', availability: 'unavailable' }
  ];

  const patientVolume = [
    { day: 'Nov 01', patients: 180 },
    { day: 'Nov 02', patients: 210 },
    { day: 'Nov 03', patients: 195 },
    { day: 'Nov 04', patients: 155 },
    { day: 'Nov 05', patients: 230 },
    { day: 'Nov 06', patients: 245 },
    { day: 'Nov 07', patients: 260 }
  ];

  const maxPatients = Math.max(...patientVolume.map(d => d.patients));

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border p-6">
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
            {/* OPD Session Management */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">OPD Session Management</h2>
              <button className="w-full bg-indigo-700 text-white py-3 rounded-lg mb-3 hover:bg-indigo-800">
                Create New Session
              </button>
              <button className="w-full bg-indigo-100 text-indigo-700 py-3 rounded-lg hover:bg-indigo-200 mb-3">
                View All Sessions
              </button>
            </div>

            {/* Doctor Availability */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Doctor Availability</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-xs font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 text-xs font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 text-xs font-semibold text-gray-900">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-4 text-sm font-medium text-gray-900">{d.name}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${d.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${d.availability === 'available' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          {d.availability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Alerts & Notifications */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Alerts & Notifications</h2>
              {alerts.map((a, i) => (
                <div key={i} className="border rounded-lg mb-3 last:mb-0">
                  <button
                    onClick={() => setExpandedAlerts(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                    className="w-full flex items-start gap-3 p-4 hover:bg-gray-50"
                  >
                    <svg className={`w-5 h-5 mt-0.5 ${a.type === 'warning' ? 'text-orange-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                      {expandedAlerts.includes(i) && a.description && (
                        <p className="text-xs text-gray-800 mt-1">{a.description}</p>
                      )}
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 ${expandedAlerts.includes(i) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Daily Patient Volume */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Daily Patient Volume</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {patientVolume.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-indigo-700 rounded-t-lg hover:bg-indigo-800 transition-all"
                      style={{ height: `${(d.patients / maxPatients) * 200}px` }}
                    />
                    <span className="text-xs text-gray-800">{d.day.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-2 mt-4">
                <div className="w-3 h-3 bg-indigo-700 rounded-sm" />
                <span className="text-xs text-gray-800">Patients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-6 text-center border-t">
          <p className="text-sm text-gray-800">© 2026 Suwapatha. All rights reserved.</p>
        </footer>
      </div>
    </AdminLayout>
  );
}
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PatientLayout from '@/app/components/patientLayout';
import { appointmentApi } from '@/app/api/appointment/appointmentApi';
import { AppointmentResponse } from '@/app/api/appointment/appointmentTypes';

function Spinner() {
  return (
    <div className="flex justify-center py-6">
      <div className="w-7 h-7 border-4 border-[#94B4C1] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    BOOKED: 'bg-[#94B4C1]/10 text-[#94B4C1]',
    CANCELLED: 'bg-red-100 text-red-600',
    COMPLETED: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
      ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function PatientDashboard() {
  const router = useRouter();

  // ── real user info from localStorage (set by authApi on register/login) ──
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Primary source: the full user object stored by authApi
    const storedUser = (() => {
      try { return JSON.parse(localStorage.getItem('user') ?? 'null'); } catch { return null; }
    })();

    if (storedUser) {
      const fullName = [storedUser.firstName, storedUser.lastName].filter(Boolean).join(' ');
      setUserName(fullName || 'Patient');
      setUserEmail(storedUser.email ?? '');
    } else {
      // Fallback to old convenience keys (legacy logins)
      setUserName(localStorage.getItem('userName') ?? 'Patient');
      setUserEmail(localStorage.getItem('userEmail') ?? '');
    }

    // First-login welcome banner — clear the flag immediately so it shows only once
    if (localStorage.getItem('isNewUser') === 'true') {
      setIsNewUser(true);
      localStorage.removeItem('isNewUser');
    }
  }, []);

  // ── real appointments ─────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [activeAppt, setActiveAppt] = useState<AppointmentResponse | null>(null);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const refreshAppointments = useCallback(async () => {
    setLoadingAppts(true);
    try {
      const [all, active] = await Promise.all([
        appointmentApi.getAll(),
        appointmentApi.getActive(),
      ]);
      setAppointments(all);
      setActiveAppt(active);
    } catch {
      // not logged in or backend not running
    } finally {
      setLoadingAppts(false);
    }
  }, []);

  useEffect(() => { refreshAppointments(); }, [refreshAppointments]);

  const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      await appointmentApi.cancel(id);
      await refreshAppointments();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to cancel.');
    } finally {
      setCancelling(null);
    }
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    ['token', 'authToken', 'userName', 'userEmail', 'name', 'email', 'user', 'userId', 'isNewUser'].forEach(
      k => localStorage.removeItem(k)
    );
    router.push('/');
  };

  // Month abbreviations for the history mini-bar chart
  const monthCounts = (() => {
    const counts: Record<string, number> = {};
    appointments.forEach(a => {
      if (!a.appointmentDate) return;
      const month = new Date(a.appointmentDate + 'T00:00:00')
        .toLocaleString('default', { month: 'short' });
      counts[month] = (counts[month] ?? 0) + 1;
    });
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const m = d.toLocaleString('default', { month: 'short' });
      return { month: m, visits: counts[m] ?? 0 };
    });
  })();

  const bookedAppointments = appointments.filter(a => a.status === 'BOOKED');

  return (
    <PatientLayout onLogout={handleLogout}>
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left Column ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* First-login welcome banner */}
          {isNewUser && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-base">Welcome to Suwapatha! 🎉</p>
                <p className="text-white/80 text-sm mt-0.5">
                  Your account is ready. Book your first appointment from the <strong>Appointments</strong> page to get started.
                </p>
              </div>
            </div>
          )}

          {/* Welcome banner */}
          <div className="bg-gradient-to-r from-[#94B4C1] to-[#7fa8b8] rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-1">
              Hello, {userName || 'Patient'} 👋
            </h2>
            <p className="text-white/80 text-sm">
              {userEmail && <span className="mr-3">{userEmail}</span>}
              {bookedAppointments.length > 0
                ? `You have ${bookedAppointments.length} upcoming appointment${bookedAppointments.length !== 1 ? 's' : ''}.`
                : 'No upcoming appointments. Book one from the Appointments page.'}
            </p>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                <p className="text-sm text-gray-500">Your next visits and their details.</p>
              </div>
              <Link href="/patient/appointments"
                className="text-sm font-medium text-[#94B4C1] hover:text-[#7fa8b8]">
                Book new →
              </Link>
            </div>

            {loadingAppts ? <Spinner /> : bookedAppointments.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm font-medium">No upcoming appointments</p>
                <Link href="/patient/appointments"
                  className="mt-2 text-sm text-[#94B4C1] hover:underline font-medium">
                  Book one now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {['Date', 'Hospital', 'Doctor', 'Queue #', 'Wait', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookedAppointments.map(apt => (
                      <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-3 text-sm text-gray-900 whitespace-nowrap">{apt.appointmentDate}</td>
                        <td className="py-4 px-3 text-sm text-gray-900 max-w-[140px] truncate">{apt.hospitalName}</td>
                        <td className="py-4 px-3 text-sm text-gray-600">{apt.doctorName || '—'}</td>
                        <td className="py-4 px-3 text-sm font-bold text-[#94B4C1]">#{apt.queueNumber}</td>
                        <td className="py-4 px-3 text-sm text-gray-600 whitespace-nowrap">
                          {apt.estimatedWaitMinutes > 0 ? `~${apt.estimatedWaitMinutes} min` : "You're next!"}
                        </td>
                        <td className="py-4 px-3">
                          <button
                            onClick={() => handleCancel(apt.id)}
                            disabled={cancelling === apt.id}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg
                              hover:bg-red-700 disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {cancelling === apt.id ? 'Cancelling…' : 'Cancel'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Queue Status (compact) */}
          {activeAppt && (
            <div className="bg-white rounded-xl border-2 border-[#94B4C1]/30 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Live Queue Status</h2>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Queue #</p>
                  <p className="text-5xl font-bold text-[#94B4C1]">{activeAppt.queueNumber}</p>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4 min-w-[200px]">
                  <div>
                    <p className="text-xs text-gray-500">Hospital</p>
                    <p className="text-sm font-semibold text-gray-900">{activeAppt.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Doctor</p>
                    <p className="text-sm font-semibold text-gray-900">{activeAppt.doctorName || 'To be assigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Est. Wait</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {activeAppt.estimatedWaitMinutes > 0
                        ? `${activeAppt.estimatedWaitMinutes} min`
                        : "You're next!"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <StatusBadge status={activeAppt.status} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vitals Trend — empty state (no vitals API yet) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">Vitals Trend</h2>
              <p className="text-sm text-gray-500">Blood pressure and heart rate over time.</p>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500 text-sm font-medium">No vitals recorded yet</p>
              <p className="text-gray-400 text-xs mt-1">Your vitals history will appear here once recorded by your doctor.</p>
            </div>
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Appointment History Chart (real data) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Visit History</h3>
            <p className="text-xs text-gray-500 mb-4">Total appointments per month (last 6).</p>
            {loadingAppts ? <Spinner /> : (
              <div className="h-32 flex items-end justify-around gap-2 px-2">
                {monthCounts.map(({ month, visits }) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-700">{visits || ''}</span>
                    <div
                      className="w-full bg-[#94B4C1] rounded-t-lg transition-all hover:bg-[#7fa8b8]"
                      style={{
                        height: visits > 0 ? `${Math.min(visits * 20, 100)}%` : '4px',
                        opacity: visits > 0 ? 1 : 0.2
                      }}
                    />
                    <span className="text-xs text-gray-500">{month}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 text-center mt-3">
              Total: {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} on record
            </p>
          </div>

          {/* Notifications — derived from real appointments */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notifications</h3>
            {loadingAppts ? <Spinner /> : bookedAppointments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-3">
                {bookedAppointments.slice(0, 3).map(apt => (
                  <div key={apt.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-[#94B4C1]/10 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Upcoming Appointment</p>
                      <p className="text-xs text-gray-500 truncate">
                        {apt.hospitalName} — Queue #{apt.queueNumber}
                        {apt.estimatedWaitMinutes > 0 ? `, ~${apt.estimatedWaitMinutes} min wait` : ', you\'re next!'}
                      </p>
                      <p className="text-xs text-gray-400">{apt.appointmentDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-xs text-gray-500 mb-4">Access common tasks instantly.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  href: '/patient/appointments', label: 'Book Appointment',
                  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                },
                {
                  href: '/patient/records', label: 'View Records',
                  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                },
                {
                  href: '/patient/settings', label: 'My Profile',
                  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                },
                {
                  href: null, label: 'Contact Support',
                  icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
                },
              ].map(({ href, label, icon }) => {
                const inner = (
                  <button className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200
                    rounded-xl hover:border-[#94B4C1] hover:bg-[#94B4C1]/5 transition-colors w-full">
                    <div className="w-10 h-10 bg-[#94B4C1]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-900 text-center">{label}</span>
                  </button>
                );
                return href
                  ? <Link key={label} href={href}>{inner}</Link>
                  : <div key={label}>{inner}</div>;
              })}
            </div>
          </div>

        </div>
      </div>
    </PatientLayout>
  );
}
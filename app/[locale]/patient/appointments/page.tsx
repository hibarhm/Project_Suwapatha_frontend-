'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {useTranslations} from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PatientLayout from '@/app/components/patientLayout';
import { appointmentApi } from '@/app/api/appointment/appointmentApi';
import {
  HospitalResponse,
  OpdSessionResponse,
  AppointmentResponse,
} from '@/app/api/appointment/appointmentTypes';

/* ── helpers ──────────────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('patientAppointments.status');
  const map: Record<string, string> = {
    BOOKED: 'bg-[#94B4C1]/10 text-[#94B4C1]',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FINISHED: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status === 'BOOKED' ? t('booked') 
        : status === 'CANCELLED' ? t('cancelled') 
        : status === 'COMPLETED' ? t('completed') 
        : status === 'FINISHED' ? t('finished')
        : status}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-4 border-[#94B4C1] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Computes the estimated UTC appointment time from session start + wait offset.
 *
 * sessionDate:      "yyyy-MM-dd"
 * sessionStartTime: "HH:mm"
 * estimatedWaitMinutes: number
 *
 * Returns a string like "14:30 UTC" (or null if inputs are invalid).
 */
function computeUtcAppointmentTime(
  sessionDate: string,
  sessionStartTime: string,
  estimatedWaitMinutes: number,
): string | null {
  if (!sessionDate || !sessionStartTime) return null;
  try {
    // Parse as UTC: combine date + start time, then add wait minutes
    const [h, m] = sessionStartTime.split(':').map(Number);
    const base = new Date(`${sessionDate}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`);
    base.setUTCMinutes(base.getUTCMinutes() + estimatedWaitMinutes);
    const hh = String(base.getUTCHours()).padStart(2, '0');
    const mm = String(base.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mm} UTC`;
  } catch {
    return null;
  }
}

/**
 * Returns a Date object for the session start time in UTC,
 * used to schedule the 10-minute alert.
 */
function getSessionStartUtc(sessionDate: string, sessionStartTime: string): Date | null {
  if (!sessionDate || !sessionStartTime) return null;
  try {
    const [h, m] = sessionStartTime.split(':').map(Number);
    return new Date(`${sessionDate}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`);
  } catch {
    return null;
  }
}

/* ── main component ───────────────────────────────────────────────────────── */
export default function AppointmentBookingPage() {
  const t = useTranslations('patientAppointments');
  const router = useRouter();

  // ── state: hospital search ──────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState<HospitalResponse[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  // ── state: selected hospital + sessions ────────────────────────────────
  const [selectedHospital, setSelectedHospital] = useState<HospitalResponse | null>(null);
  const [sessions, setSessions] = useState<OpdSessionResponse[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // ── state: booking ──────────────────────────────────────────────────────
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');

  // ── state: active appointment (queue card) ──────────────────────────────
  const [activeAppt, setActiveAppt] = useState<AppointmentResponse | null>(null);
  const [loadingActive, setLoadingActive] = useState(true);

  // ── state: appointment history ──────────────────────────────────────────
  const [history, setHistory] = useState<AppointmentResponse[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // ── ref: 10-min alert timer ────────────────────────────────────────────
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── data fetching ──────────────────────────────────────────────────────── */

  const refreshAppointments = useCallback(async () => {
    setLoadingActive(true);
    setLoadingHistory(true);
    try {
      const [active, all] = await Promise.all([
        appointmentApi.getActive(),
        appointmentApi.getAll(),
      ]);
      setActiveAppt(active);
      setHistory(all);
    } catch {
      // Silently handle — user may not yet have any appointments
    } finally {
      setLoadingActive(false);
      setLoadingHistory(false);
    }
  }, []);

  // Load on mount + refresh every 60 s to keep queue live
  useEffect(() => {
    refreshAppointments();
    const interval = setInterval(refreshAppointments, 60_000);
    return () => clearInterval(interval);
  }, [refreshAppointments]);

  // Hospital search with 400 ms debounce
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoadingHospitals(true);
      try {
        setHospitals(await appointmentApi.getHospitals(searchQuery));
      } catch {
        setHospitals([]);
      } finally {
        setLoadingHospitals(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load sessions when a hospital is selected
  useEffect(() => {
    if (!selectedHospital) { setSessions([]); return; }
    setLoadingSessions(true);
    appointmentApi.getSessions(selectedHospital.id)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  }, [selectedHospital]);

  /* ── 10-minute pre-appointment alert ──────────────────────────────────── */
  useEffect(() => {
    // Clear any existing timer whenever activeAppt changes
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }

    if (!activeAppt || activeAppt.status !== 'BOOKED') return;

    const sessionStart = getSessionStartUtc(
      activeAppt.appointmentDate,
      activeAppt.sessionStartTime,
    );
    if (!sessionStart) return;

    // Fire the alert 10 minutes before session start
    const alertAt = new Date(sessionStart.getTime() - 10 * 60 * 1000);
    const msUntilAlert = alertAt.getTime() - Date.now();

    if (msUntilAlert <= 0) return; // already past

    alertTimerRef.current = setTimeout(async () => {
      const msg = t('alerts.reminderMessage', {hospital: activeAppt.hospitalName});

      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(t('alerts.reminderTitle'), { body: msg, icon: '/favicon.ico' });
        } else if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            new Notification(t('alerts.reminderTitle'), { body: msg, icon: '/favicon.ico' });
          } else {
            alert(msg);
          }
        } else {
          alert(msg);
        }
      } else {
        alert(msg);
      }
    }, msUntilAlert);

    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, [activeAppt]);

  // Request notification permission proactively when a BOOKED appointment exists
  useEffect(() => {
    if (
      activeAppt?.status === 'BOOKED' &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission();
    }
  }, [activeAppt]);

  /* ── actions ─────────────────────────────────────────────────────────────── */

  const handleBook = async (sessionId: string) => {
    setBooking(true);
    setBookError('');
    setBookSuccess('');
    try {
      await appointmentApi.book({ sessionId });
      setBookSuccess(t('alerts.bookedSuccess'));
      await Promise.all([
        refreshAppointments(),
        selectedHospital
          ? appointmentApi.getSessions(selectedHospital.id).then(setSessions)
          : Promise.resolve(),
      ]);
    } catch (e) {
      setBookError(e instanceof Error ? e.message : t('alerts.bookingFailed'));
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      await appointmentApi.cancel(id);
      await refreshAppointments();
    } catch (e) {
      alert(e instanceof Error ? e.message : t('alerts.cancelFailed'));
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  /* ── derived display values ───────────────────────────────────────────── */

  const isNextInQueue = activeAppt && (activeAppt.isNext || activeAppt.status === 'CONSULTING');
  const getSessionStatusLabel = (status: string) => {
    if (status === 'OPEN') return t('sessions.statusOpen');
    if (status === 'FULL') return t('sessions.statusFull');
    return status;
  };

  const utcAppointmentTime = activeAppt
    ? computeUtcAppointmentTime(
      activeAppt.appointmentDate,
      activeAppt.sessionStartTime,
      activeAppt.estimatedWaitMinutes,
    )
    : null;

  /* ── render ──────────────────────────────────────────────────────────────── */
  return (
    <PatientLayout onLogout={handleLogout}>
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left Column ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Hospital Search ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('hospitalSearch.title')}</h2>

            <div className="relative mb-4">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('hospitalSearch.placeholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg
                  focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]
                  text-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            {loadingHospitals && <Spinner />}

            {!loadingHospitals && hospitals.length > 0 && (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {hospitals.map(hosp => (
                  <button
                    key={hosp.id}
                    onClick={() => {
                      setSelectedHospital(hosp);
                      setBookError('');
                      setBookSuccess('');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border
                      ${selectedHospital?.id === hosp.id
                        ? 'bg-[#94B4C1] text-white border-[#94B4C1]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#94B4C1] hover:text-[#94B4C1]'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">{hosp.name}</span>
                      </div>
                      <span className={`text-xs ${selectedHospital?.id === hosp.id ? 'text-white/70' : 'text-gray-400'}`}>
                        {hosp.district}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loadingHospitals && searchQuery && hospitals.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">{t('hospitalSearch.noResults', {query: searchQuery})}</p>
            )}

            {!loadingHospitals && !searchQuery && hospitals.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                {t('hospitalSearch.startTyping')}
              </p>
            )}
          </div>

          {/* ── OPD Sessions / Booking ── */}
          {selectedHospital && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t('sessions.title')}</h2>
                  <p className="text-sm text-gray-500">{selectedHospital.name}</p>
                </div>
                <button
                  onClick={() => { setSelectedHospital(null); setSessions([]); }}
                  className="text-xs text-gray-400 hover:text-gray-600 mt-1"
                >
                  {t('sessions.clear')}
                </button>
              </div>

              {bookSuccess && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {bookSuccess}
                </div>
              )}
              {bookError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {bookError}
                </div>
              )}

              {loadingSessions && <Spinner />}

              {!loadingSessions && sessions.length === 0 && (
                <div className="flex flex-col items-center py-10 text-center">
                  <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm font-medium">{t('sessions.emptyTitle')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('sessions.emptySubtitle')}</p>
                </div>
              )}

              {!loadingSessions && sessions.length > 0 && (
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div key={session.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-[#94B4C1]/40 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-gray-900 text-sm">{session.department}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                              ${session.status === 'OPEN' ? 'bg-green-100 text-green-700'
                                : session.status === 'FULL' ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-500'}`}>
                              {getSessionStatusLabel(session.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {session.date} &nbsp;·&nbsp; {session.startTime}–{session.endTime}
                            {session.doctorName && ` · ${session.doctorName}`}
                            {session.room && t('sessions.roomSuffix', {room: session.room})}
                          </p>
                          {/* Queue progress bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all
                                  ${session.availableSlots === 0 ? 'bg-orange-400'
                                    : session.availableSlots <= 5 ? 'bg-yellow-400'
                                      : 'bg-[#94B4C1]'}`}
                                style={{ width: `${(session.currentQueueCount / session.maxQueueSize) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {session.currentQueueCount}/{session.maxQueueSize}
                              &nbsp;·&nbsp;
                              {session.availableSlots > 0
                                ? t('sessions.slotsLeft', {count: session.availableSlots})
                                : t('sessions.full')}
                            </span>
                          </div>
                        </div>

                        <button
                          disabled={session.status !== 'OPEN' || booking}
                          onClick={() => handleBook(session.id)}
                          className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                            ${session.status === 'OPEN'
                              ? 'bg-[#94B4C1] hover:bg-[#7fa8b8] text-white'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          {booking ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {t('sessions.booking')}
                            </span>
                          ) : session.status === 'OPEN' ? t('sessions.book') : getSessionStatusLabel(session.status)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Queue Status Card ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('queue.title')}</h2>

            {loadingActive ? <Spinner /> : activeAppt ? (
              <>
                <div className="bg-gradient-to-br from-gray-50 to-[#94B4C1]/5 rounded-xl p-8 mb-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">{t('queue.yourNumber')}</p>
                    <p className="text-6xl font-bold text-[#94B4C1]">{activeAppt.queueNumber}</p>

                    {/* "You're next!" badge — only shown for the immediately next patient */}
                    {isNextInQueue && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5
                        bg-green-100 text-green-700 rounded-full text-sm font-semibold animate-pulse">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        {t('queue.youAreNext')}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                        label: t('queue.estimatedAppointment'),
                        value: (activeAppt.status === 'CONSULTING' || activeAppt.isNext)
                          ? t('queue.nextProceed')
                          : (utcAppointmentTime ?? t('queue.minutesOnly', {minutes: activeAppt.estimatedWaitMinutes})),
                      },
                      {
                        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5',
                        label: t('queue.hospital'),
                        value: activeAppt.hospitalName,
                      },
                      {
                        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                        label: t('queue.doctor'),
                        value: activeAppt.doctorName || t('common.toBeAssigned'),
                      },
                      {
                        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5',
                        label: t('queue.room'),
                        value: activeAppt.room || t('common.notAvailable'),
                      },
                      {
                        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                        label: t('queue.status'),
                        value: null,
                        badge: <StatusBadge status={activeAppt.status} />,
                      },
                    ].map(({ icon, label, value, badge }) => (
                      <div key={label}>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                          </svg>
                          {label}
                        </div>
                        {badge ?? <p className="text-base font-semibold text-gray-900">{value}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(activeAppt.id)}
                  disabled={!!cancelling}
                  className="w-full flex items-center justify-center gap-2
                    bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6
                    rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {cancelling ? t('actions.cancelling') : t('actions.cancelAppointment')}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-1">{t('queue.emptyTitle')}</p>
                <p className="text-sm text-gray-500">{t('queue.emptySubtitle')}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* ── Appointment History ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('history.title')}</h3>

            {loadingHistory ? <Spinner /> : history.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-gray-500">{t('history.empty')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(apt => (
                  <div key={apt.id}
                    className="border border-gray-100 rounded-lg p-3 hover:border-[#94B4C1]/30 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{apt.hospitalName}</p>
                      <StatusBadge status={apt.status} />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {t('history.itemMeta', {date: apt.appointmentDate, queue: apt.queueNumber})}
                      {apt.doctorName ? ` · ${apt.doctorName}` : ''}
                    </p>
                    {apt.status === 'BOOKED' && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        disabled={cancelling === apt.id}
                        className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                      >
                        {cancelling === apt.id ? t('actions.cancelling') : t('actions.cancel')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Tips ── */}
          <div className="bg-[#94B4C1]/5 rounded-xl border border-[#94B4C1]/20 p-5">
            <h3 className="text-sm font-bold text-[#94B4C1] mb-3">{t('tips.title')}</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>{t('tips.item1')}</li>
              <li>{t('tips.item2')}</li>
              <li>{t('tips.item3')}</li>
              <li>{t('tips.item4')}</li>
              <li>{t('tips.item5')}</li>
            </ul>
          </div>
        </div>

      </div>
    </PatientLayout>
  );
}
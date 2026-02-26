'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PatientLayout from '@/app/components/patientLayout';
import { userApi } from '@/app/api/user/userApi';
import { UserProfile } from '@/app/api/user/userTypes';

// ── tiny toast ──────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5
      rounded-xl shadow-lg text-sm font-medium animate-fade-in
      ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success'
        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
      {msg}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#94B4C1] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── section wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

// ── input field ──────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputCls = `w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900
  focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] transition-all`;

export default function PatientSettingsPage() {
  const router = useRouter();

  // ── state ──────────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // editable profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergency, setEmergency] = useState('');

  // password fields
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  // notification prefs (local only — no backend yet)
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true });

  // saving states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── load profile ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    userApi.getProfile()
      .then(p => {
        if (cancelled) return;
        setProfile(p);
        setFirstName(p.firstName ?? '');
        setLastName(p.lastName ?? '');
        setPhone(p.phoneNumber ?? '');
        setAddress(p.address ?? '');
        setEmergency(p.emergencyContact ?? '');
      })
      .catch(() => {
        // Fall back to localStorage if backend fails
        try {
          const stored = JSON.parse(localStorage.getItem('user') ?? 'null');
          if (stored && !cancelled) {
            setProfile(stored);
            setFirstName(stored.firstName ?? '');
            setLastName(stored.lastName ?? '');
            setPhone(stored.phoneNumber ?? '');
            setAddress(stored.address ?? '');
            setEmergency(stored.emergencyContact ?? '');
          }
        } catch { /* ignore */ }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── save profile ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showToast('First name and last name are required.', 'error');
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await userApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone.trim(),
        address: address.trim(),
        emergencyContact: emergency.trim(),
      });
      setProfile(updated);
      showToast('Profile updated successfully!', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to save profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── change password ───────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      showToast('All password fields are required.', 'error');
      return;
    }
    if (passwords.next.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.next });
      setPasswords({ current: '', next: '', confirm: '' });
      showToast('Password changed successfully!', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to change password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    ['token', 'authToken', 'user', 'userName', 'userEmail', 'userId', 'isNewUser', 'name', 'email']
      .forEach(k => localStorage.removeItem(k));
    router.push('/');
  };

  // ── avatar initials ───────────────────────────────────────────────────────
  const initials = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || '?';

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <PatientLayout onLogout={handleLogout}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {loading ? <Spinner /> : (
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Profile Information ──────────────────────────────────────── */}
          <Section title="Profile Information" subtitle="Update your name and contact details.">
            {/* Avatar */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#7fa8b8]
                flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 select-none">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {firstName} {lastName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{profile?.email}</p>
                {profile?.role && (
                  <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                    bg-[#94B4C1]/10 text-[#94B4C1]">
                    {profile.role.charAt(0) + profile.role.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Name row */}
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <Field label="First Name">
                <input className={inputCls} value={firstName}
                  onChange={e => setFirstName(e.target.value)} placeholder="First name" />
              </Field>
              <Field label="Last Name">
                <input className={inputCls} value={lastName}
                  onChange={e => setLastName(e.target.value)} placeholder="Last name" />
              </Field>
            </div>

            {/* Phone */}
            <div className="mb-5">
              <Field label="Phone Number">
                <input className={inputCls} value={phone} type="tel"
                  onChange={e => setPhone(e.target.value)} placeholder="e.g. 0771234567" />
              </Field>
            </div>

            {/* Read-only fields */}
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              {profile?.dateOfBirth && (
                <Field label="Date of Birth">
                  <input className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
                    value={profile.dateOfBirth} readOnly />
                </Field>
              )}
              {profile?.gender && (
                <Field label="Gender">
                  <input className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
                    value={profile.gender} readOnly />
                </Field>
              )}
            </div>

            {/* Address */}
            <div className="mb-5">
              <Field label="Address">
                <textarea className={`${inputCls} resize-none`} rows={2} value={address}
                  onChange={e => setAddress(e.target.value)} placeholder="Your address" />
              </Field>
            </div>

            {/* Emergency Contact */}
            <div className="mb-6">
              <Field label="Emergency Contact (optional)">
                <input className={inputCls} value={emergency}
                  onChange={e => setEmergency(e.target.value)} placeholder="Name and phone number" />
              </Field>
            </div>

            <div className="flex justify-end">
              <button onClick={handleSaveProfile} disabled={savingProfile}
                className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-semibold
                  hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {savingProfile && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {savingProfile ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </Section>

          {/* ── Email Address ─────────────────────────────────────────────── */}
          <Section title="Email Address" subtitle="Your verified email address for login and notifications.">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-800 font-medium flex-1">{profile?.email}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                bg-emerald-50 text-emerald-700">
                Verified
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Email changes require identity verification. Contact support to update your email.
            </p>
          </Section>

          {/* ── Password ──────────────────────────────────────────────────── */}
          <Section title="Password" subtitle="Change your account password.">
            <div className="space-y-5 mb-6">
              {[
                { label: 'Current Password', key: 'current' as const },
                { label: 'New Password', key: 'next' as const },
                { label: 'Confirm New Password', key: 'confirm' as const },
              ].map(({ label, key }) => (
                <Field key={key} label={label}>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input type="password" placeholder="••••••••"
                      value={passwords[key]}
                      onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                      className={`${inputCls} pl-11`} />
                  </div>
                </Field>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={handleChangePassword} disabled={savingPassword}
                className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-semibold
                  hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {savingPassword && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {savingPassword ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </Section>

          {/* ── Notification Preferences ──────────────────────────────────── */}
          <Section title="Notification Preferences" subtitle="Choose how you receive updates and alerts.">
            <div className="space-y-1">
              {([
                { key: 'email' as const, title: 'Email Notifications', sub: 'Receive important updates via email.' },
                { key: 'sms' as const, title: 'SMS Notifications', sub: 'Real-time alerts on your phone.' },
                { key: 'push' as const, title: 'Push Notifications', sub: 'Instant alerts in your browser.' },
              ]).map(({ key, title, sub }) => (
                <div key={key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                  </div>
                  <button
                    onClick={() => setNotifs({ ...notifs, [key]: !notifs[key] })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-[#94B4C1] focus:ring-offset-2
                      ${notifs[key] ? 'bg-[#94B4C1]' : 'bg-gray-200'}`}
                    aria-label={title}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                      ${notifs[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Account Management ────────────────────────────────────────── */}
          <Section title="Account Management" subtitle="Danger zone — permanent actions.">
            <p className="text-sm text-gray-600 mb-5">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                  showToast('Account deletion is not available yet. Please contact support.', 'error');
                }
              }}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold
                hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </Section>

        </div>
      )}
    </PatientLayout>
  );
}
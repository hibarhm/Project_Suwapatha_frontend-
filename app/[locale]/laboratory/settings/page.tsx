'use client';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import LaboratoryLayout from '@/app/components/laboratoryLayout';
import RequireRole from '@/app/components/RequireRole';
import API_BASE_URL from '@/app/api/api';

interface LabProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  hospitalId?: string;
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5
      rounded-xl shadow-lg text-sm font-medium
      ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success'
        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
      {msg}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

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

export default function LaboratorySettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<LabProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getAuthToken = () => localStorage.getItem('authToken') || localStorage.getItem('token');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) { router.push('/login/laboratory'); return; }

      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (res.status === 401) { localStorage.clear(); router.push('/login/laboratory'); return; }
      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      setProfile(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
    } catch (err) {
      console.error(err);
      showToast('Failed to load profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showToast('First name and last name are required.', 'error');
      return;
    }
    setSavingProfile(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Failed to update'); }
      const updated = await res.json();
      setProfile(updated);
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        u.firstName = updated.firstName; u.lastName = updated.lastName;
        localStorage.setItem('user', JSON.stringify(u));
        localStorage.setItem('userName', `${updated.firstName} ${updated.lastName}`);
      }
      showToast('Profile updated successfully!', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to save profile.', 'error');
    } finally { setSavingProfile(false); }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      showToast('All password fields are required.', 'error'); return;
    }
    if (passwords.next !== passwords.confirm) {
      showToast('New passwords do not match.', 'error'); return;
    }
    if (passwords.next.length < 8) {
      showToast('Password must be at least 8 characters.', 'error'); return;
    }
    setSavingPassword(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Failed to change password'); }
      setPasswords({ current: '', next: '', confirm: '' });
      showToast('Password changed successfully!', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Failed to change password.', 'error');
    } finally { setSavingPassword(false); }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/'); };

  if (loading) {
    return (
      <RequireRole allowedRoles={['LABORATORY', 'ADMIN']}>
        <LaboratoryLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto" />
              <p className="mt-4 text-gray-600">Loading settings...</p>
            </div>
          </div>
        </LaboratoryLayout>
      </RequireRole>
    );
  }

  return (
    <RequireRole allowedRoles={['LABORATORY', 'ADMIN']}>
      <LaboratoryLayout>
        {toast && <Toast msg={toast.msg} type={toast.type} />}

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your laboratory staff profile and account security.</p>
          </div>

          {/* Profile Section */}
          <Section title="Personal Information" subtitle="Update your name displayed across the system.">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#7fa8b8]
                flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {firstName?.[0]?.toUpperCase()}{lastName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{firstName} {lastName}</p>
                <p className="text-sm text-gray-500 mt-0.5">{profile?.email}</p>
                <span className="mt-1 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#94B4C1]/10 text-[#94B4C1]">
                  Laboratory Staff
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <Field label="First Name">
                <input className={inputCls} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
              </Field>
              <Field label="Last Name">
                <input className={inputCls} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
              </Field>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">Email Address</p>
                  <p className="text-sm text-blue-700 mt-1">{profile?.email}</p>
                  <p className="text-xs text-blue-600 mt-1">Email address cannot be changed. Contact your administrator for assistance.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={fetchProfile}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-semibold hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {savingProfile && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Section>

          {/* Security Section */}
          <Section title="Security" subtitle="Change your account password. Use a strong password to protect your account.">
            <div className="space-y-4 mb-6">
              <Field label="Current Password">
                <input type="password" className={inputCls} value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" />
              </Field>
              <Field label="New Password">
                <input type="password" className={inputCls} value={passwords.next}
                  onChange={e => setPasswords({ ...passwords, next: e.target.value })} placeholder="••••••••" />
              </Field>
              <Field label="Confirm New Password">
                <input type="password" className={inputCls} value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" />
              </Field>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-900">Password Requirements</p>
                  <ul className="text-xs text-amber-700 mt-1 list-disc list-inside space-y-0.5">
                    <li>Minimum 8 characters long</li>
                    <li>Use a mix of letters, numbers, and symbols for best security</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-semibold hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {savingPassword && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </Section>

          {/* Account Actions */}
          <Section title="Account Actions" subtitle="Sign out of the laboratory portal.">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 border-2 border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </Section>
        </div>
      </LaboratoryLayout>
    </RequireRole>
  );
}

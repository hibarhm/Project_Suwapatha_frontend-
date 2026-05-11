'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/adminLayout';
import { userApi } from '@/app/api/user/userApi';
import { UserProfile } from '@/app/api/user/userTypes';
import {useTranslations} from 'next-intl';

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

export default function AdminSettingsPage() {
  const t = useTranslations('adminSettingsPage');
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    userApi.getProfile()
      .then(p => {
        setProfile(p);
        setFirstName(p.firstName);
        setLastName(p.lastName);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showToast(t('toasts.nameEmpty'), 'error');
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await userApi.updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
      setProfile(updated);
      showToast(t('toasts.profileUpdated'), 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : t('toasts.updateFailed'), 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showToast(t('toasts.passwordFieldsRequired'), 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showToast(t('toasts.passwordMismatch'), 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword({ currentPassword: passwords.current, newPassword: passwords.new });
      setPasswords({ current: '', new: '', confirm: '' });
      showToast(t('toasts.passwordUpdated'), 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : t('toasts.passwordChangeFailed'), 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) return <div className="p-20 text-center text-gray-500">{t('loading')}</div>;

  return (
    <AdminLayout>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Profile Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('profile.subtitle')}</p>
          </div>

          {/* Profile Photo */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#A1C2BD] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {firstName?.[0]}{lastName?.[0]}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t('profile.photoTitle')}</h3>
              <p className="text-xs text-gray-500 mb-3">{t('profile.photoHint')}</p>
              <button className="text-sm font-medium text-[#94B4C1] hover:text-[#7fa8b8]">
                {t('profile.changePhoto')}
              </button>
            </div>
          </div>

          {/* Name and Username */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('fields.firstName')}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('fields.lastName')}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-medium hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 flex items-center gap-2">
              {savingProfile && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {savingProfile ? t('actions.saving') : t('actions.saveChanges')}
            </button>
          </div>
        </div>

        {/* Email Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('email.title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('email.subtitle')}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('email.label')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={profile?.email ?? ''}
                readOnly
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-900 mr-3">{t('email.statusLabel')}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#94B4C1]/10 text-[#94B4C1]">
              {t('email.verified')}
            </span>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('password.title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('password.subtitle')}</p>
          </div>

          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('password.current')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('password.new')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t('password.confirm')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-medium hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 flex items-center gap-2">
              {savingPassword && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {savingPassword ? t('actions.updating') : t('actions.updatePassword')}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('notifications.subtitle')}</p>
          </div>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-start justify-between py-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('notifications.emailTitle')}</h3>
                <p className="text-sm text-gray-600">{t('notifications.emailDesc')}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#94B4C1] focus:ring-offset-2 ${notifications.email ? 'bg-[#94B4C1]' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-start justify-between py-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('notifications.smsTitle')}</h3>
                <p className="text-sm text-gray-600">{t('notifications.smsDesc')}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#94B4C1] focus:ring-offset-2 ${notifications.sms ? 'bg-[#94B4C1]' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Push Notifications */}
            <div className="flex items-start justify-between py-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{t('notifications.pushTitle')}</h3>
                <p className="text-sm text-gray-600">{t('notifications.pushDesc')}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#94B4C1] focus:ring-offset-2 ${notifications.push ? 'bg-[#94B4C1]' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('account.title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('account.subtitle')}</p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-700">
              {t('account.warning')}
            </p>
          </div>
          <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            {t('account.delete')}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
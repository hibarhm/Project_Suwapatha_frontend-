'use client';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import DoctorLayout from '@/app/components/doctorLayout';
import API_BASE_URL from '@/app/api/api';
import RequireRole from '@/app/components/RequireRole';

// ── Types ────────────────────────────────────────────────────────────────────
interface DoctorProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    nic?: string;
    doctorId?: string;
    status: string;
}

// ── Tiny Toast ───────────────────────────────────────────────────────────────
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

export default function DoctorSettingsPage() {
    const t = useTranslations('doctorSettings');
    const router = useRouter();

    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [nic, setNic] = useState('');

    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const getAuthToken = () => {
        return localStorage.getItem('authToken') || localStorage.getItem('token');
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();

            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                localStorage.clear();
                router.push('/login');
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfile(data);
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setPhone(data.phone || '');
            setNic(data.nic || '');
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
            showToast(t('errors.loadProfile'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            showToast(t('errors.nameRequired'), 'error');
            return;
        }

        // Validate phone number (Sri Lankan format: 10 digits)
        if (phone && !/^\d{10}$/.test(phone.trim())) {
            showToast(t('errors.phoneDigits'), 'error');
            return;
        }

        // Validate NIC (Sri Lankan format: 9 digits + V/X or 12 digits)
        if (nic && !/^(\d{9}[VvXx]|\d{12})$/.test(nic.trim())) {
            showToast(t('errors.nicInvalid'), 'error');
            return;
        }

        setSavingProfile(true);
        try {
            const token = getAuthToken();

            const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    phone: phone.trim() || null,
                    nic: nic.trim() || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updated = await response.json();
            setProfile(updated);

            // Update localStorage if user data is stored there
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.firstName = updated.firstName;
                userData.lastName = updated.lastName;
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('userName', `${updated.firstName} ${updated.lastName}`);
            }

            showToast('Profile updated successfully!', 'success');
        } catch (e) {
            console.error('Error updating profile:', e);
            showToast(e instanceof Error ? e.message : t('errors.saveProfile'), 'error');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.next || !passwords.confirm) {
            showToast(t('errors.allPasswordFieldsRequired'), 'error');
            return;
        }
        if (passwords.next !== passwords.confirm) {
            showToast(t('errors.passwordMismatch'), 'error');
            return;
        }
        if (passwords.next.length < 8) {
            showToast(t('errors.passwordLength'), 'error');
            return;
        }

        setSavingPassword(true);
        try {
            const token = getAuthToken();

            const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.next,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            setPasswords({ current: '', next: '', confirm: '' });
            showToast(t('passwordChanged'), 'success');
        } catch (e) {
            console.error('Error changing password:', e);
            showToast(e instanceof Error ? e.message : t('errors.changePassword'), 'error');
        } finally {
            setSavingPassword(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    const getProfileStatusLabel = (status?: string) => {
        switch (status) {
            case 'APPROVED':
                return t('profileStatus.approved');
            case 'PENDING':
                return t('profileStatus.pending');
            case 'REJECTED':
                return t('profileStatus.rejected');
            default:
                return status ?? '';
        }
    };

    if (loading) {
        return (
            <RequireRole allowedRoles={['DOCTOR']} redirectTo="/login/doctor">
                <DoctorLayout>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
                            <p className="mt-4 text-gray-600">{t('loading')}</p>
                        </div>
                    </div>
                </DoctorLayout>
            </RequireRole>
        );
    }

    if (error && !profile) {
        return (
            <RequireRole allowedRoles={['DOCTOR']} redirectTo="/login/doctor">
                <DoctorLayout>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('errors.loadSettingsTitle')}</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={fetchProfile}
                                className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors"
                            >
                                {t('tryAgain')}
                            </button>
                        </div>
                    </div>
                </DoctorLayout>
            </RequireRole>
        );
    }

    return (
        <RequireRole allowedRoles={['DOCTOR']} redirectTo="/login/doctor">
            <DoctorLayout>
                {toast && <Toast msg={toast.msg} type={toast.type} />}

            <div className="max-w-3xl mx-auto space-y-6 p-6">
                <Section title={t('sections.profile.title')} subtitle={t('sections.profile.subtitle')}>
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#7fa8b8]
              flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {firstName?.[0]?.toUpperCase()}{lastName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{firstName} {lastName}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{profile?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#94B4C1]/10 text-[#94B4C1]">
                                    {t('doctorRole')}
                                </span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${profile?.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-800'
                                        : profile?.status === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {getProfileStatusLabel(profile?.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                        <Field label={t('fields.firstName')}>
                            <input
                                className={inputCls}
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                placeholder={t('placeholders.firstName')}
                            />
                        </Field>
                        <Field label={t('fields.lastName')}>
                            <input
                                className={inputCls}
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                placeholder={t('placeholders.lastName')}
                            />
                        </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-6">
                        <Field label={t('fields.phoneNumber')}>
                            <input
                                className={inputCls}
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="0771234567"
                                maxLength={10}
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('hints.phoneDigits')}</p>
                        </Field>
                        <Field label={t('fields.nicNumber')}>
                            <input
                                className={inputCls}
                                value={nic}
                                onChange={e => setNic(e.target.value)}
                                placeholder="123456789V or 200012345678"
                                maxLength={12}
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('hints.nic')}</p>
                        </Field>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-blue-900">{t('fields.emailAddress')}</p>
                                <p className="text-sm text-blue-700 mt-1">{profile?.email}</p>
                                <p className="text-xs text-blue-600 mt-1">{t('emailImmutable')}</p>
                            </div>
                        </div>
                    </div>

                    {profile?.doctorId && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                            <p className="text-sm text-gray-600">
                                {t('doctorIdLabel')}: <span className="font-semibold text-gray-900">{profile.doctorId}</span>
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={fetchProfile}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            {t('reset')}
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-semibold hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {savingProfile && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {savingProfile ? t('saving') : t('saveChanges')}
                        </button>
                    </div>
                </Section>

                <Section title={t('sections.security.title')} subtitle={t('sections.security.subtitle')}>
                    <div className="space-y-4 mb-6">
                        <Field label={t('fields.currentPassword')}>
                            <input
                                type="password"
                                className={inputCls}
                                value={passwords.current}
                                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                placeholder="••••••••"
                            />
                        </Field>
                        <Field label={t('fields.newPassword')}>
                            <input
                                type="password"
                                className={inputCls}
                                value={passwords.next}
                                onChange={e => setPasswords({ ...passwords, next: e.target.value })}
                                placeholder="••••••••"
                            />
                        </Field>
                        <Field label={t('fields.confirmNewPassword')}>
                            <input
                                type="password"
                                className={inputCls}
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                placeholder="••••••••"
                            />
                        </Field>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-amber-900">{t('passwordRequirements.title')}</p>
                                <ul className="text-xs text-amber-700 mt-1 list-disc list-inside space-y-0.5">
                                    <li>{t('passwordRequirements.item1')}</li>
                                    <li>{t('passwordRequirements.item2')}</li>
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
                            {savingPassword ? t('updating') : t('updatePassword')}
                        </button>
                    </div>
                </Section>

                <Section title={t('sections.accountActions.title')} subtitle={t('sections.accountActions.subtitle')}>
                    <div className="space-y-3">
                        <button
                            onClick={handleLogout}
                            className="w-full px-6 py-3 border-2 border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {t('logout')}
                        </button>
                    </div>
                </Section>
            </div>
            </DoctorLayout>
        </RequireRole>
    );
}
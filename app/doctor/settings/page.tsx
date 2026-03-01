'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorLayout from '@/app/components/doctorLayout';
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
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
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
                setFirstName(p.firstName ?? '');
                setLastName(p.lastName ?? '');
                setPhone(p.phoneNumber ?? '');
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSaveProfile = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            showToast('Name fields are required.', 'error');
            return;
        }
        setSavingProfile(true);
        try {
            const updated = await userApi.updateProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phone.trim(),
            });
            setProfile(updated);
            showToast('Profile updated successfully!', 'success');
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Failed to save profile.', 'error');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.next || !passwords.confirm) {
            showToast('All fields are required.', 'error');
            return;
        }
        if (passwords.next !== passwords.confirm) {
            showToast('Passwords do not match.', 'error');
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (loading) return <div className="p-20 text-center text-gray-500">Loading settings…</div>;

    return (
        <DoctorLayout>
            {toast && <Toast msg={toast.msg} type={toast.type} />}

            <div className="max-w-3xl mx-auto space-y-6">
                <Section title="Profile Information" subtitle="Update your basic information.">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#7fa8b8]
              flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {firstName?.[0]}{lastName?.[0]}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{firstName} {lastName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{profile?.email}</p>
                            <span className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#94B4C1]/10 text-[#94B4C1]">
                                Doctor
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                        <Field label="First Name">
                            <input className={inputCls} value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </Field>
                        <Field label="Last Name">
                            <input className={inputCls} value={lastName} onChange={e => setLastName(e.target.value)} />
                        </Field>
                    </div>

                    <div className="mb-6">
                        <Field label="Phone Number">
                            <input className={inputCls} value={phone} onChange={e => setPhone(e.target.value)} />
                        </Field>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleSaveProfile} disabled={savingProfile}
                            className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-semibold hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 flex items-center gap-2">
                            {savingProfile && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {savingProfile ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </Section>

                <Section title="Hospital Information" subtitle="Your affiliated hospital details.">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">Hospital ID: <span className="font-semibold text-gray-900">{profile?.hospitalId}</span></p>
                        <p className="text-xs text-gray-400 mt-2">Hospital affiliation changes must be requested through the administration.</p>
                    </div>
                </Section>

                <Section title="Password" subtitle="Change your account password.">
                    <div className="space-y-4 mb-6">
                        <Field label="Current Password">
                            <input type="password" className={inputCls} value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                        </Field>
                        <Field label="New Password">
                            <input type="password" className={inputCls} value={passwords.next} onChange={e => setPasswords({ ...passwords, next: e.target.value })} />
                        </Field>
                        <Field label="Confirm New Password">
                            <input type="password" className={inputCls} value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                        </Field>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleChangePassword} disabled={savingPassword}
                            className="px-6 py-2.5 bg-[#94B4C1] text-white rounded-lg text-sm font-semibold hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 flex items-center gap-2">
                            {savingPassword && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {savingPassword ? 'Updating…' : 'Update Password'}
                        </button>
                    </div>
                </Section>
            </div>
        </DoctorLayout>
    );
}

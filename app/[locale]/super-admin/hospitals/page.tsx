'use client';

import { useEffect, useMemo, useState } from 'react';
import RequireRole from '@/app/components/RequireRole';
import SuperAdminLayout from '@/app/components/superAdminLayout';
import { superAdminApi, SuperAdminHospital } from '@/app/api/superAdmin/superAdminApi';
import {useTranslations} from 'next-intl';

export default function SuperAdminHospitalsPage() {
  const t = useTranslations('superAdminHospitalsPage');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<SuperAdminHospital[]>([]);
  const [query, setQuery] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<SuperAdminHospital | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await superAdminApi.getHospitals();
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('errors.loadHospitals'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((h) =>
      `${h.name} ${h.district ?? ''} ${h.province ?? ''}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleCreateAdmin = async () => {
    setCreateLoading(true);
    setCreateError('');
    try {
      if (!selectedHospital?.id) throw new Error(t('errors.hospitalRequired'));
      if (!form.firstName.trim()) throw new Error(t('errors.firstNameRequired'));
      if (!form.lastName.trim()) throw new Error(t('errors.lastNameRequired'));
      if (!form.email.trim()) throw new Error(t('errors.emailRequired'));
      if (mode === 'create') {
        if (!form.password) throw new Error(t('errors.passwordRequired'));
        await superAdminApi.createHospitalAdmin(selectedHospital.id, {
          email: form.email.trim(),
          password: form.password,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        });
      } else {
        await superAdminApi.updateHospitalAdmin(selectedHospital.id, {
          email: form.email.trim(),
          password: form.password || undefined,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        });
      }

      setCreateOpen(false);
      setSelectedHospital(null);
      setMode('create');
      setForm({ email: '', password: '', firstName: '', lastName: '' });
      await load();
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : mode === 'create' ? t('errors.createAdmin') : t('errors.updateAdmin'));
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <RequireRole allowedRoles={['SUPER_ADMIN']} redirectTo="/super-admin/login">
      <SuperAdminLayout>
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
              />
            </div>
            <button
              onClick={load}
              className="px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700"
            >
              {t('refresh')}
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-600">{t('loadingHospitals')}</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-gray-900">{t('emptyTitle')}</p>
              <p className="text-xs text-gray-600 mt-1">{t('emptySubtitle')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-xs font-semibold text-gray-700">{t('table.name')}</th>
                    <th className="text-left py-3 text-xs font-semibold text-gray-700">{t('table.district')}</th>
                    <th className="text-left py-3 text-xs font-semibold text-gray-700">{t('table.province')}</th>
                    <th className="text-left py-3 text-xs font-semibold text-gray-700">{t('table.phone')}</th>
                    <th className="text-right py-3 text-xs font-semibold text-gray-700">{t('table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h) => (
                    <tr key={h.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-4 text-sm font-medium text-gray-900">{h.name}</td>
                      <td className="py-4 text-sm text-gray-700">{h.district ?? t('notAvailable')}</td>
                      <td className="py-4 text-sm text-gray-700">{h.province ?? t('notAvailable')}</td>
                      <td className="py-4 text-sm text-gray-700">{h.phone ?? t('notAvailable')}</td>
                      <td className="py-4 text-right">
                        {h.hasAdmin ? (
                          <button
                            onClick={() => {
                              setSelectedHospital(h);
                              setMode('edit');
                              setForm({
                                email: h.admin?.email ?? '',
                                password: '',
                                firstName: h.admin?.firstName ?? '',
                                lastName: h.admin?.lastName ?? '',
                              });
                              setCreateOpen(true);
                            }}
                            className="px-3 py-2 rounded-lg border border-[#94B4C1]/40 bg-white text-[#94B4C1] hover:bg-[#94B4C1]/10 text-sm font-medium"
                          >
                            {t('editAdmin')}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedHospital(h);
                              setMode('create');
                              setForm({ email: '', password: '', firstName: '', lastName: '' });
                              setCreateOpen(true);
                            }}
                            className="px-3 py-2 rounded-lg bg-[#94B4C1] text-white hover:bg-[#7fa8b8] text-sm font-medium"
                          >
                            {t('createAdmin')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !createLoading && setCreateOpen(false)} />
            <div
              className="relative z-10 bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {mode === 'create' ? t('modal.createTitle') : t('modal.editTitle')}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('modal.hospitalLabel')}: <span className="font-semibold text-gray-900">{selectedHospital?.name ?? t('notAvailable')}</span>
                  </p>
                </div>
                <button
                  onClick={() => !createLoading && setCreateOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {createError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{createError}</div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">{t('modal.firstName')}</label>
                    <input
                      value={form.firstName}
                      onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">{t('modal.lastName')}</label>
                    <input
                      value={form.lastName}
                      onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">{t('modal.email')}</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      type="email"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                      {mode === 'create' ? t('modal.passwordCreate') : t('modal.passwordEdit')}
                    </label>
                    <input
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      type="password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => !createLoading && setCreateOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  {t('modal.cancel')}
                </button>
                <button
                  onClick={handleCreateAdmin}
                  disabled={createLoading}
                  className="px-5 py-2.5 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] font-medium transition-colors disabled:opacity-50"
                >
                  {createLoading ? (mode === 'create' ? t('modal.creating') : t('modal.saving')) : (mode === 'create' ? t('createAdmin') : t('modal.saveChanges'))}
                </button>
              </div>
            </div>
          </div>
        )}
      </SuperAdminLayout>
    </RequireRole>
  );
}


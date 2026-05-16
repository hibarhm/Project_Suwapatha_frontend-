'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import LaboratoryLayout from '@/app/components/laboratoryLayout';
import RequireRole from '@/app/components/RequireRole';
import API_BASE_URL from '@/app/api/api';
import { Link } from '@/i18n/navigation';

interface LabRequest {
  id: string;
  patientName: string;
  doctorName: string;
  priority: 'NORMAL' | 'URGENT';
  status: 'PENDING' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED';
  requestedAt: string;
  requestedTests: string[];
}

export default function LaboratoryDashboard() {
  const t = useTranslations('laboratory.dashboard');
  const ts = useTranslations('laboratory.status');
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const hospitalId = user.hospitalId;

      if (!hospitalId) {
        console.error('No hospital ID found for user');
        setLoading(false);
        return;
      }

      let url = `${API_BASE_URL}/api/laboratory/hospital/${hospitalId}`;
      if (filter !== 'ALL') {
        url += `/status/${filter}`;
      }

      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SAMPLE_COLLECTED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(req => 
    req.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RequireRole allowedRoles={['LABORATORY', 'ADMIN']}>
      <LaboratoryLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
              <p className="text-gray-600">{t('subtitle')}</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {['PENDING', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED'].map((status) => (
              <div key={status} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-1">{ts(status.toLowerCase())}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === status).length}
                </p>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1 max-w-md relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex gap-2">
                {['ALL', 'PENDING', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === f ? 'bg-[#94B4C1] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : ts(f.toLowerCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">{t('noRequests')}</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('patient')}</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('priority')}</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('requestDate')}</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{request.patientName}</p>
                        <p className="text-xs text-gray-600">{request.requestedTests.join(', ')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.priority === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {ts(request.status.toLowerCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/laboratory/requests/${request.id}`}>
                          <button className="text-[#94B4C1] hover:text-[#7fa8b8] font-medium text-sm">
                            {t('viewDetails')}
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </LaboratoryLayout>
    </RequireRole>
  );
}

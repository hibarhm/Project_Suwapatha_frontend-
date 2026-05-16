'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import LaboratoryLayout from '@/app/components/laboratoryLayout';
import RequireRole from '@/app/components/RequireRole';
import API_BASE_URL from '@/app/api/api';
import { Link } from '@/i18n/navigation';

interface LabTestResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  remarks: string;
}

interface LabRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  requestedTests: string[];
  notes: string;
  priority: string;
  status: 'PENDING' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED';
  results: LabTestResult[];
  reportUrls: string[];
}

export default function LabRequestDetails() {
  const t = useTranslations('laboratory.requestDetails');
  const ts = useTranslations('laboratory.status');
  const router = useRouter();
  const { id } = useParams();
  const [request, setRequest] = useState<LabRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<LabTestResult[]>([]);
  const [reportUrls, setReportUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/laboratory/request/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequest(data);
        setResults(data.results.length > 0 ? data.results : data.requestedTests.map((name: string) => ({
          testName: name,
          value: '',
          unit: '',
          referenceRange: '',
          remarks: ''
        })));
        setReportUrls(data.reportUrls || []);
      }
    } catch (err) {
      console.error('Error fetching request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/laboratory/request/${id}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequest(data);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleResultChange = (index: number, field: keyof LabTestResult, value: string) => {
    const newResults = [...results];
    newResults[index][field] = value;
    setResults(newResults);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/laboratory/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const url = await response.text();
        setReportUrls([...reportUrls, url]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitResults = async () => {
    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/api/laboratory/request/${id}/results`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          reportUrls,
          staffId: user.id
        }),
      });

      if (response.ok) {
        router.push('/laboratory/dashboard');
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!request) return <div className="p-8 text-center">Request not found</div>;

  return (
    <RequireRole allowedRoles={['LABORATORY', 'ADMIN']}>
      <LaboratoryLayout>
        <div className="max-w-5xl mx-auto pb-12">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/laboratory/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToDashboard')}
            </Link>
            <div className="flex gap-2">
              {['SAMPLE_COLLECTED', 'PROCESSING'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    request.status === status ? 'bg-[#94B4C1] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ts(status.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Results Form */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('results')}</h2>
                <div className="space-y-8">
                  {results.map((res, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-4">{res.testName}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('value')}</label>
                          <input
                            type="text"
                            value={res.value}
                            onChange={(e) => handleResultChange(index, 'value', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('unit')}</label>
                          <input
                            type="text"
                            value={res.unit}
                            onChange={(e) => handleResultChange(index, 'unit', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('referenceRange')}</label>
                          <input
                            type="text"
                            value={res.referenceRange}
                            onChange={(e) => handleResultChange(index, 'referenceRange', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{t('remarks')}</label>
                        <input
                          type="text"
                          value={res.remarks}
                          onChange={(e) => handleResultChange(index, 'remarks', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#94B4C1] focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Reports */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('uploadReports')}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">{t('dropFiles')}</span></p>
                        <p className="text-xs text-gray-500">{t('supportedFormats')}</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>
                  
                  {uploading && <p className="text-sm text-blue-600 animate-pulse">Uploading...</p>}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {reportUrls.map((url, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                        <span className="truncate max-w-[150px]">{url.split('/').pop()}</span>
                        <button onClick={() => setReportUrls(reportUrls.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitResults}
                  disabled={submitting}
                  className="px-8 py-3 bg-[#94B4C1] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#7fa8b8] transition-all disabled:opacity-50"
                >
                  {submitting ? t('submitting') : t('submitResults')}
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {/* Patient Info Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{t('patientInfo')}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Name</p>
                    <p className="text-sm font-medium">{request.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">ID</p>
                    <p className="text-sm font-medium">{request.patientId}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Info Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{t('doctorInfo')}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Requested By</p>
                    <p className="text-sm font-medium">{request.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Priority</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${
                      request.priority === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {request.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">{t('notes')}</h3>
                <p className="text-sm text-gray-700 italic">
                  {request.notes || 'No notes provided by the doctor.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </LaboratoryLayout>
    </RequireRole>
  );
}

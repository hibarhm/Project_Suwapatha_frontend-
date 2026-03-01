'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PatientLayout from '@/app/components/patientLayout';
import API_BASE_URL from '@/app/api/api';

interface Prescription {
  name: string;
  dosage: string;
}

interface MedicalVisit {
  id: string;
  date: string;
  time: string;
  hospital: string;
  doctor: string;
  followUpRequired: boolean;
  consultationNotes: string;
  prescriptions: Prescription[];
  labReports: number;
  labReportUrls?: string[];
}

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedVisitType, setSelectedVisitType] = useState('');

  // State for medical records
  const [medicalVisits, setMedicalVisits] = useState<MedicalVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for patient info
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');

  // Fetch medical records on component mount
  useEffect(() => {
    fetchMedicalRecords();
    fetchPatientInfo();
  }, []);

  // Fetch patient info
  const fetchPatientInfo = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientName(`${data.firstName} ${data.lastName}`);
        setPatientId(data.id);
      }
    } catch (err) {
      console.error('Error fetching patient info:', err);
    }
  };

  // Fetch medical records
  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/medical-records`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }

      const data = await response.json();
      setMedicalVisits(data);
      setError('');
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Build query parameters
      const params = new URLSearchParams();
      if (dateRange) {
        // You'll need to parse dateRange and add startDate/endDate
        // For now, this is a placeholder
      }
      if (selectedHospital) {
        params.append('hospital', selectedHospital);
      }

      const url = `${API_BASE_URL}/api/medical-records/filter?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to filter medical records');
      }

      const data = await response.json();
      setMedicalVisits(data);
      setError('');
    } catch (err) {
      console.error('Error filtering medical records:', err);
      setError('Failed to filter medical records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when filter values change
  useEffect(() => {
    if (selectedHospital) {
      applyFilters();
    }
  }, [selectedHospital]);

  const toggleVisit = (id: string) => {
    setExpandedVisit(expandedVisit === id ? null : id);
  };

  const clearFilters = () => {
    setDateRange('');
    setSelectedHospital('');
    setSelectedVisitType('');
    fetchMedicalRecords(); // Reload all records
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // Download PDF handler
  const handleDownloadVisitPDF = async (visitId: string) => {
    // Implement PDF download logic
    alert(`Downloading PDF for visit ${visitId}`);
  };

  const handleDownloadAllPDF = async () => {
    // Implement download all logic
    alert('Downloading all medical records as PDF');
  };

  const handleShareLink = () => {
    // Implement share functionality
    alert('Share link functionality');
  };

  if (loading) {
    return (
      <PatientLayout onLogout={handleLogout}>
        <div className="p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading medical records...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout onLogout={handleLogout}>
      <div className="p-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="text"
              placeholder="Select a date range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="outline-none bg-transparent text-gray-700 min-w-[160px]"
            />
          </div>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]"
          >
            <option value="">Select Hospital</option>
            <option value="Central Hospital">Central Hospital</option>
            <option value="District Clinic">District Clinic</option>
            <option value="General Hospital">General Hospital</option>
          </select>
          <select
            value={selectedVisitType}
            onChange={(e) => setSelectedVisitType(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]"
          >
            <option value="">Select Visit Type</option>
            <option value="routine">Routine Check-up</option>
            <option value="followup">Follow-up</option>
            <option value="emergency">Emergency</option>
          </select>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        </div>

        {/* Patient Info & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patientName || 'Loading...'}</h1>
            <p className="text-sm text-gray-600">Patient ID: {patientId || 'Loading...'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAllPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download All PDF
            </button>
            <button
              onClick={handleShareLink}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#94B4C1] hover:text-[#94B4C1] transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share link
            </button>
          </div>
        </div>

        {/* Empty State */}
        {medicalVisits.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical Records Found</h3>
            <p className="text-gray-600">You don't have any medical records yet.</p>
          </div>
        )}

        {/* Medical Records List */}
        <div className="space-y-4">
          {medicalVisits.map((visit) => (
            <div
              key={visit.id}
              className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${expandedVisit === visit.id ? 'border-[#94B4C1] shadow-md' : 'border-gray-200'
                }`}
            >
              {/* Visit Header */}
              <div
                onClick={() => toggleVisit(visit.id)}
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-start gap-6">
                  <div className="flex items-center gap-2">
                    {expandedVisit === visit.id && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-[#94B4C1]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#94B4C1]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#94B4C1]"></div>
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{visit.date}</h3>
                    <p className="text-sm text-gray-600">{visit.time}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{visit.hospital}</h3>
                    <p className="text-sm text-gray-600">{visit.doctor}</p>
                  </div>
                  {visit.followUpRequired && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      Follow-up Required
                    </span>
                  )}
                </div>
                <button>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform ${expandedVisit === visit.id ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Expanded Content */}
              {expandedVisit === visit.id && (
                <div className="px-6 pb-6 space-y-6 border-t border-gray-200 pt-6">
                  {/* Consultation Notes */}
                  <div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">Consultation Notes</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{visit.consultationNotes}</p>
                  </div>

                  {/* Prescriptions */}
                  {visit.prescriptions && visit.prescriptions.length > 0 && (
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-3">Prescriptions</h4>
                      <div className="space-y-2">
                        {visit.prescriptions.map((prescription, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-sm font-medium text-gray-900">{prescription.name}</span>
                            <span className="text-sm text-gray-600">{prescription.dosage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lab Reports & Images */}
                  <div>
                    <h4 className="text-base font-bold text-gray-900 mb-3">Lab Reports & Images</h4>
                    <div className="flex gap-3 flex-wrap">
                      {Array.from({ length: visit.labReports }).map((_, index) => (
                        <div
                          key={index}
                          className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                        >
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDownloadVisitPDF(visit.id)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Visit PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
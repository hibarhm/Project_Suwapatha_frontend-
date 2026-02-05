'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PatientLayout from '@/app/components/patientLayout';

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [expandedVisit, setExpandedVisit] = useState<number | null>(1);
  const [dateRange, setDateRange] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedVisitType, setSelectedVisitType] = useState('');

  // Sample medical records data
  const medicalVisits = [
    {
      id: 1,
      date: 'Oct 26, 2025',
      time: '10:30 AM',
      hospital: 'Central Hospital',
      doctor: 'Dr. Asha Perera',
      followUpRequired: true,
      consultationNotes: 'Patient presented with a persistent cough and mild fever for 3 days. Throat slightly red, lungs clear on auscultation. Advised rest and increased fluid intake.',
      prescriptions: [
        { name: 'Amoxicillin', dosage: '500mg for 7 days' },
        { name: 'Paracetamol', dosage: '500mg as needed' }
      ],
      labReports: 2
    },
    {
      id: 2,
      date: 'Sep 15, 2025',
      time: '03:00 PM',
      hospital: 'District Clinic',
      doctor: 'Dr. Nimal Gamage',
      followUpRequired: false,
      consultationNotes: 'Routine check-up. Blood pressure within normal range. Patient reports feeling well. Discussed diet and exercise.',
      prescriptions: [],
      labReports: 1
    },
    {
      id: 3,
      date: 'Jul 01, 2025',
      time: '09:00 AM',
      hospital: 'General Hospital',
      doctor: 'Dr. Sithumi Silva',
      followUpRequired: false,
      consultationNotes: 'Annual physical examination. All vital signs normal. No concerns reported.',
      prescriptions: [],
      labReports: 0
    },
    {
      id: 4,
      date: 'May 10, 2025',
      time: '11:45 AM',
      hospital: 'General Hospital',
      doctor: 'Dr. Asha Perera',
      followUpRequired: true,
      consultationNotes: 'Follow-up for allergies. Patient condition improved. Continue current medication regimen.',
      prescriptions: [],
      labReports: 0
    },
    {
      id: 5,
      date: 'Mar 20, 2025',
      time: '03:15 PM',
      hospital: 'District Clinic',
      doctor: 'Dr. Nimal Gamage',
      followUpRequired: false,
      consultationNotes: 'Initial consultation for seasonal allergies. Prescribed antihistamines.',
      prescriptions: [],
      labReports: 0
    }
  ];

  const toggleVisit = (id: number) => {
    setExpandedVisit(expandedVisit === id ? null : id);
  };

  const clearFilters = () => {
    setDateRange('');
    setSelectedHospital('');
    setSelectedVisitType('');
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <PatientLayout onLogout={handleLogout}>
      <div className="p-8">
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
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none"
          >
            <option value="">Select Hospital</option>
            <option value="central">Central Hospital</option>
            <option value="district">District Clinic</option>
            <option value="general">General Hospital</option>
          </select>

          <select
            value={selectedVisitType}
            onChange={(e) => setSelectedVisitType(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none"
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
            <h1 className="text-2xl font-bold text-gray-900">Amara Fernando</h1>
            <p className="text-sm text-gray-600">Patient ID: SF8765432</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download All PDF
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share link
            </button>
          </div>
        </div>

        {/* Medical Records List */}
        <div className="space-y-4">
          {medicalVisits.map((visit) => (
            <div
              key={visit.id}
              className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                expandedVisit === visit.id ? 'border-indigo-300' : 'border-gray-200'
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
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
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
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedVisit === visit.id ? 'rotate-180' : ''
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
                  {visit.prescriptions.length > 0 && (
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

                    <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors text-sm font-medium">
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
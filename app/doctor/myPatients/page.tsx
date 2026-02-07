'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorLayout from '@/app/components/doctorLayout';

export default function MyPatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample patient data
  const patients = [
    { id: 1, queueNo: 'Q001', name: 'Alice Johnson', avatar: '/avatars/alice.jpg', gender: 'Female', time: '09:00 AM', status: 'Waiting' },
    { id: 2, queueNo: 'Q002', name: 'Bob Williams', avatar: '/avatars/bob.jpg', gender: 'Male', time: '09:30 AM', status: 'Consulting' },
    { id: 3, queueNo: 'Q003', name: 'Charlie Brown', avatar: '/avatars/charlie.jpg', gender: 'Male', time: '10:00 AM', status: 'Waiting' },
    { id: 4, queueNo: 'Q004', name: 'Diana Prince', avatar: '/avatars/diana.jpg', gender: 'Female', time: '10:30 AM', status: 'Missed' },
    { id: 5, queueNo: 'Q005', name: 'Ethan Hunt', avatar: '/avatars/ethan.jpg', gender: 'Male', time: '11:00 AM', status: 'Waiting' },
    { id: 6, queueNo: 'Q006', name: 'Fiona Green', avatar: '/avatars/fiona.jpg', gender: 'Female', time: '11:30 AM', status: 'Waiting' },
    { id: 7, queueNo: 'Q007', name: 'George Miller', avatar: '/avatars/george.jpg', gender: 'Male', time: '12:00 PM', status: 'Completed' },
    { id: 8, queueNo: 'Q008', name: 'Hannah White', avatar: '/avatars/hannah.jpg', gender: 'Female', time: '12:30 PM', status: 'Waiting' }
  ];

  // Filter patients
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.queueNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting':
        return 'bg-slate-100 text-slate-700';
      case 'Consulting':
        return 'bg-pink-100 text-pink-700';
      case 'Missed':
        return 'bg-red-100 text-red-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Navigate to patient details page
  const handleViewPatient = (patientId: number) => {
    router.push(`/doctor/myPatients/${patientId}`);
  };

  return (
    <DoctorLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Total Patients Today:</span>
          <span className="text-2xl font-bold text-[#94B4C1]">{patients.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by Name or Queue No."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Queue No.</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Patient Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Gender</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Time</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient, index) => (
                <tr 
                  key={index} 
                  onClick={() => handleViewPatient(patient.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">{patient.queueNo}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#94B4C1] to-[#A1C2BD] flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(patient.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">{patient.gender}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{patient.time}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {/* View Details */}
                      <button
                        onClick={() => handleViewPatient(patient.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Medical Records */}
                      <button
                        onClick={() => handleViewPatient(patient.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Medical Records"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>

                      {/* Complete/Check */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Marked patient ${patient.name} as complete`);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Mark Complete"
                      >
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
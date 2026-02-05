'use client';

import { useState } from 'react';
import AdminLayout from '@/app/components/adminLayout'; // Adjust path as needed

export default function DoctorRegistrationReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Sample data
  const doctors = [
    { id: 'DOC-101', name: 'Dr. Anya Sharma', specialty: 'Cardiology', status: 'Pending Review' },
    { id: 'DOC-102', name: 'Dr. Ben Carter', specialty: 'Pediatrics', status: 'Pending Review' },
    { id: 'DOC-103', name: 'Dr. Clara Dixon', specialty: 'Dermatology', status: 'Approved' },
    { id: 'DOC-104', name: 'Dr. David Evans', specialty: 'Orthopedics', status: 'Pending Review' },
    { id: 'DOC-105', name: 'Dr. Emily Foster', specialty: 'Neurology', status: 'Pending Review' },
    { id: 'DOC-106', name: 'Dr. Frank Green', specialty: 'Oncology', status: 'On Hold' },
    { id: 'DOC-107', name: 'Dr. Grace Hall', specialty: 'Ophthalmology', status: 'Pending Review' },
  ];

  const stats = {
    total: 7,
    pending: 4,
    approvedToday: 1,
    onHold: 1,
  };

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers (you can connect these to real API calls later)
  const handleApprove = (id: string) => {
    alert(`Approved doctor: ${id}`);
    // In real app: update status via API
  };

  const handleReject = (id: string) => {
    alert(`Rejected doctor: ${id}`);
    // In real app: update status via API
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Registration Review</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Total Registered</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50">
            <div className="text-sm text-gray-600">Pending Review</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50">
            <div className="text-sm text-gray-600">Approved Today</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.approvedToday}</div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50">
            <div className="text-sm text-gray-600">On Hold</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{stats.onHold}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-900"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>All Statuses</option>
            <option>Pending Review</option>
            <option>Approved</option>
            <option>On Hold</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.specialty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : doctor.status === 'Pending Review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {doctor.status === 'Pending Review' ? (
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleApprove(doctor.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(doctor.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDoctors.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No doctors found matching your filters.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
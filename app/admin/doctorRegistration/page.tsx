'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/components/adminLayout';
import { adminApi, Doctor } from '@/app/api/admin/adminApi';
import DoctorReviewModal from '@/app/components/doctorReviewModal';

export default function DoctorRegistrationReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getAllDoctors();
      setDoctors(data);
      setError('');
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const stats = {
    total: doctors.length,
    pending: doctors.filter(d => d.status === 'PENDING').length,
    approved: doctors.filter(d => d.status === 'APPROVED').length,
    rejected: doctors.filter(d => d.status === 'REJECTED').length,
  };

  // Filter doctors
  const filteredDoctors = doctors.filter((doc) => {
    const fullName = `${doc.firstName} ${doc.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      doc.doctorId.toLowerCase().includes(searchTerm.toLowerCase());

    // Exact match for status filter
    const matchesStatus = statusFilter === 'All Statuses' || doc.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveDoctor(id);
      
      // Update local state
      setDoctors(doctors.map(doc =>
        doc.id === id ? { ...doc, status: 'APPROVED' } : doc
      ));
      
      alert('Doctor approved successfully! Notification email has been sent.');
      handleCloseModal();
    } catch (err) {
      console.error('Error approving doctor:', err);
      alert('Failed to approve doctor. Please try again.');
      throw err; // Re-throw to let modal handle loading state
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminApi.rejectDoctor(id);
      
      // Update local state
      setDoctors(doctors.map(doc =>
        doc.id === id ? { ...doc, status: 'REJECTED' } : doc
      ));
      
      alert('Doctor registration rejected. Notification email has been sent.');
      handleCloseModal();
    } catch (err) {
      console.error('Error rejecting doctor:', err);
      alert('Failed to reject doctor. Please try again.');
      throw err;
    }
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
          <div 
            className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => setStatusFilter('PENDING')}
          >
            <div className="text-sm text-gray-600">Pending Review</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</div>
          </div>
          <div 
            className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => setStatusFilter('APPROVED')}
          >
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</div>
          </div>
          <div 
            className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => setStatusFilter('REJECTED')}
          >
            <div className="text-sm text-gray-600">Rejected</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-gray-900 placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]"
          >
            <option>All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#94B4C1] mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading doctors...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#94B4C1]/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-[#94B4C1] font-semibold text-sm">
                                {doctor.firstName[0]}{doctor.lastName[0]}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-semibold text-gray-900">
                                Dr. {doctor.firstName} {doctor.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{doctor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.doctorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              doctor.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : doctor.status === 'PENDING'
                                ? 'bg-[#94B4C1]/10 text-[#94B4C1]'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {doctor.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(doctor)}
                            className="text-[#94B4C1] hover:text-[#7fa8b8] font-semibold"
                          >
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredDoctors.length === 0 && (
                <div className="py-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
                  <p className="text-gray-600">No doctors matching your search criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Updated Modal */}
        {selectedDoctor && (
          <DoctorReviewModal
            doctor={selectedDoctor}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </AdminLayout>
  );
}
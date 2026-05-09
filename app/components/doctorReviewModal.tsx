'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';

import { Doctor } from '@/app/api/admin/adminApi';

interface DoctorReviewModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (doctorId: string) => void;
  onReject: (doctorId: string) => void;
}

export default function DoctorReviewModal({
  doctor,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: DoctorReviewModalProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(doctor.id);
      onClose();
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this doctor registration?')) {
      return;
    }
    setIsRejecting(true);
    try {
      await onReject(doctor.id);
      onClose();
    } catch (error) {
      console.error('Rejection error:', error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-white/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Dr. {doctor.firstName} {doctor.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{doctor.doctorId}</span>
              <span className="px-2 py-0.5 bg-[#94B4C1]/10 text-[#94B4C1] text-xs font-semibold rounded">
                Pending Review
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Registration Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Registration Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">First Name</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.firstName}</p>
              </div>
              {/* Last Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Last Name</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.lastName}</p>
              </div>
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <p className="text-sm font-semibold text-gray-900 break-all">{doctor.email}</p>
              </div>
              {/* Doctor ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Doctor ID Number</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.doctorId}</p>
              </div>
              {/* NIC */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">NIC Number</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.nic}</p>
              </div>
              {/* Phone */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.phone}</p>
              </div>
              {/* Gender */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Gender</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.gender}</p>
              </div>
              {/* Date of Birth */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(doctor.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Submission Info */}
          <div className="bg-[#94B4C1]/5 border border-[#94B4C1]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#94B4C1] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-[#94B4C1] mb-1">Submitted on</p>
                <p className="text-sm text-gray-700">
                  {new Date(doctor.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button
            onClick={handleReject}
            disabled={isRejecting || isApproving}
            className="flex-1 px-4 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRejecting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Rejecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Reject</span>
              </>
            )}
          </button>

          <button
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
            className="flex-1 px-4 py-3 bg-[#94B4C1] text-white rounded-lg font-semibold hover:bg-[#7fa8b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isApproving ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Approving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Approve Registration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
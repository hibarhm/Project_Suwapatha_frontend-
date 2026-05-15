'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import {useTranslations} from 'next-intl';

import { Doctor } from '@/app/api/admin/adminApi';

interface DoctorReviewModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (doctorId: string) => void;
  onReject: (doctorId: string, reason: string) => void;
}

export default function DoctorReviewModal({
  doctor,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: DoctorReviewModalProps) {
  const t = useTranslations('doctorReviewModal');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

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
    if (!showRejectionForm) {
      setShowRejectionForm(true);
      return;
    }

    if (!rejectionReason.trim()) {
      alert(t('reasonRequired'));
      return;
    }

    if (!confirm(t('confirmReject'))) {
      return;
    }

    setIsRejecting(true);
    try {
      await onReject(doctor.id, rejectionReason);
      onClose();
    } catch (error) {
      console.error('Rejection error:', error);
    } finally {
      setIsRejecting(false);
    }
  };

  const cancelRejection = () => {
    setShowRejectionForm(false);
    setRejectionReason('');
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
                {t('pendingReview')}
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
              {t('registrationDetails')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.firstName')}</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.firstName}</p>
              </div>
              {/* Last Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.lastName')}</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.lastName}</p>
              </div>
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.email')}</p>
                <p className="text-sm font-semibold text-gray-900 break-all">{doctor.email}</p>
              </div>
              {/* Doctor ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.doctorId')}</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.doctorId}</p>
              </div>
              {/* NIC */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.nic')}</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.nic}</p>
              </div>
              {/* Phone */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.phone')}</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.phone}</p>
              </div>
              {/* Gender */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.gender')}</p>
                <p className="text-sm font-semibold text-gray-900">{doctor.gender}</p>
              </div>
              {/* Date of Birth */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{t('fields.dob')}</p>
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
                <p className="text-sm font-semibold text-[#94B4C1] mb-1">{t('submittedOn')}</p>
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
          
          {/* Rejection Form */}
          {showRejectionForm && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {t('rejectionReasonLabel')}
              </div>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t('rejectionReasonPlaceholder')}
                className="w-full h-32 px-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={cancelRejection}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                {t('cancelRejection')}
              </button>
            </div>
          )}
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
                <span>{t('rejecting')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{showRejectionForm ? t('confirmRejectAction') : t('reject')}</span>
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
                <span>{t('approving')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('approveRegistration')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
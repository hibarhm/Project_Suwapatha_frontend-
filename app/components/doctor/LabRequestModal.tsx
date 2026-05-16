'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import API_BASE_URL from '@/app/api/api';

interface LabRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

export default function LabRequestModal({ isOpen, onClose, patientId, patientName }: LabRequestModalProps) {
  const t = useTranslations('laboratory.requestModal');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const commonTests = [
    'Full Blood Count (FBC)',
    'Blood Glucose (Fasting/Random)',
    'Lipid Profile',
    'Liver Function Test (LFT)',
    'Renal Function Test (RFT)',
    'Urine Full Report (UFR)',
    'HbA1c',
    'Thyroid Profile (T3, T4, TSH)',
    'C-Reactive Protein (CRP)',
    'Serum Electrolytes'
  ];

  const toggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleRequest = async () => {
    if (selectedTests.length === 0) return;

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/api/laboratory/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          patientName,
          doctorId: user.id,
          doctorName: `Dr. ${user.firstName} ${user.lastName}`,
          hospitalId: user.hospitalId,
          requestedTests: selectedTests,
          notes,
          priority,
          status: 'PENDING'
        }),
      });

      if (response.ok) {
        onClose();
        alert(t('success'));
      } else {
        alert(t('error'));
      }
    } catch (err) {
      console.error('Request failed:', err);
      alert(t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#94B4C1] text-white">
          <h2 className="text-xl font-bold">{t('title')}</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-4">{t('selectTests')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonTests.map((test) => (
                <button
                  key={test}
                  onClick={() => toggleTest(test)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    selectedTests.includes(test)
                      ? 'border-[#94B4C1] bg-[#94B4C1]/10 text-[#94B4C1] font-bold shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{test}</span>
                    {selectedTests.includes(test) && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('priority')}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPriority('NORMAL')}
                  className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                    priority === 'NORMAL' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  {t('normal')}
                </button>
                <button
                  onClick={() => setPriority('URGENT')}
                  className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                    priority === 'URGENT' ? 'bg-red-50 border-red-200 text-red-700 shadow-inner' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  {t('urgent')}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('notes')}</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#94B4C1] focus:border-transparent resize-none"
              placeholder={t('notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRequest}
            disabled={submitting || selectedTests.length === 0}
            className="px-8 py-2.5 bg-[#94B4C1] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#7fa8b8] transition-all disabled:opacity-50"
          >
            {submitting ? t('requesting') : t('request')}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // ← default style (you can override)
import { cn } from '@/app/lib/utils'; // ← shadcn cn helper (create if missing)

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    date: string;
    totalSlots: number;
    slotDuration: number;
  };
  setFormData: Dispatch<
    SetStateAction<{
      date: string;
      totalSlots: number;
      slotDuration: number;
    }>
  >;
  onCreate: () => void;
}

export default function CreateSessionModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onCreate,
}: CreateSessionModalProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  if (!isOpen) return null;

  // Convert string date to Date object for DayPicker
  const selectedDate = formData.date ? new Date(formData.date) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, 'yyyy-MM-dd');
      setFormData({ ...formData, date: formatted });
    }
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10 bg-white rounded-xl
          max-w-2xl w-full max-h-[90vh] overflow-y-auto
          shadow-2xl border border-gray-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New OPD Session</h2>
              <p className="text-sm text-gray-600 mt-1">All sessions run from 08:00 to 12:00</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Date & Total Slots */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>

              {/* Custom date trigger (click to open calendar) */}
              <div
                className={cn(
                  "w-full px-4 py-3 border border-gray-200 rounded-lg",
                  "focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1]",
                  "text-sm cursor-pointer bg-white flex items-center justify-between",
                  !formData.date && "text-gray-400"
                )}
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {formData.date
                  ? format(new Date(formData.date), 'PPP')
                  : 'Select date'}
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Calendar popover */}
              {showCalendar && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={{
                      before: new Date(),
                      after: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    }}
                    classNames={{
                      day: cn(
                        "h-9 w-9 p-0 font-normal",
                        "hover:bg-[#94B4C1]/10 focus:bg-[#94B4C1]/20"
                      ),
                      day_selected: "bg-[#94B4C1] text-white hover:bg-[#7fa8b8]",
                      day_today: "bg-gray-100 text-gray-900",
                      head_cell: "text-gray-500 font-normal text-sm",
                      caption: "text-gray-900 font-medium",
                    }}
                  />
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1.5">Up to 7 days in advance</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Total Slots</label>
              <input
                type="number"
                value={formData.totalSlots}
                onChange={(e) => setFormData({ ...formData, totalSlots: Number(e.target.value) || 30 })}
                min={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm"
              />
            </div>
          </div>

          {/* Fixed Time & Slot Duration */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Session Time</label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                08:00 – 12:00 (fixed morning session)
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Slot Duration (minutes)</label>
              <input
                type="number"
                value={formData.slotDuration}
                onChange={(e) => setFormData({ ...formData, slotDuration: Number(e.target.value) || 15 })}
                min={5}
                step={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#94B4C1] focus:ring-1 focus:ring-[#94B4C1] text-sm"
              />
            </div>
          </div>

          {/* Note box */}
          <div className="bg-[#94B4C1]/5 border border-[#94B4C1]/20 rounded-lg p-4 text-sm">
            <p className="text-[#94B4C1] font-medium">
              <strong>Note:</strong> General consultation only (08:00–12:00). Doctors & rooms assigned on the day. Patients cannot choose a specific doctor.
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-5 py-2.5 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] font-medium transition-colors"
          >
            Create Session
          </button>
        </div>
      </div>
    </div>
  );
}
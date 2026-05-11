'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import { useParams } from 'next/navigation';
import DoctorLayout from '@/app/components/doctorLayout';
import { doctorApi, PatientDetails } from '@/app/api/doctor/doctorApi';
import RequireRole from '@/app/components/RequireRole';

export default function PatientDetailsPage() {
  const t = useTranslations('doctorPatientDetails');
  const router = useRouter();
  const params = useParams();
  const patientRecordId = params.id as string;

  const [activeTab, setActiveTab] = useState('overview'); // overview, history, prescriptions
  const [isEditing, setIsEditing] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientDetails | null>(null);

  const [currentNotes, setCurrentNotes] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState('');

  // Vitals state
  const [vitals, setVitals] = useState({
    bp: '',
    temp: '',
    pulse: '',
    weight: ''
  });

  const [prescriptions, setPrescriptions] = useState<Array<{
    id?: number | string;
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    status: string;
  }>>([]);

  useEffect(() => {
    if (patientRecordId) {
      fetchPatientDetails();
    }
  }, [patientRecordId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      // In a real app, the patientRecordId might be the ID from the My Patients list
      // which we should resolve to a real patient ID if it's an appointment ID
      const data = await doctorApi.getPatientDetails(patientRecordId);
      setPatient(data);
      setPrescriptions(data.activePrescriptions || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching patient details:', err);
      setError(err.message || t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const [newPrescription, setNewPrescription] = useState({
    medicine: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const handleAddPrescription = () => {
    if (newPrescription.medicine && newPrescription.dosage) {
      setPrescriptions([
        ...prescriptions,
        { ...newPrescription, id: Date.now(), status: 'Active' }
      ]);
      setNewPrescription({ medicine: '', dosage: '', frequency: '', duration: '' });
      setShowPrescriptionModal(false);
    }
  };

  const handleSaveConsultation = async () => {
    if (!currentDiagnosis || !currentNotes) {
      alert(t('alerts.enterDiagnosisAndNotes'));
      return;
    }

    if (!patient) return;

    try {
      setLoading(true);
      await doctorApi.saveConsultation({
        patientId: patient.id,
        diagnosis: currentDiagnosis,
        consultationNotes: currentNotes,
        bp: vitals.bp,
        temp: vitals.temp,
        pulse: vitals.pulse,
        weight: vitals.weight,
        prescriptions: prescriptions.map(p => ({
          medicine: p.medicine,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          status: 'Active'
        })),
        followUpRequired: false, // Default
        hospitalName: patient.hospitalName || 'Central Hospital', // Fallback or get from patient details if available
        appointmentId: patient.currentAppointmentId
      });

      alert(t('alerts.consultationSaved'));
      setIsEditing(false);
      setCurrentDiagnosis('');
      setCurrentNotes('');
      setVitals({ bp: '', temp: '', pulse: '', weight: '' });
      fetchPatientDetails(); // Refresh history
    } catch (err: any) {
      console.error('Error saving consultation:', err);
      alert(err.message || t('alerts.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPrescriptionStatusLabel = (status: string) => {
    if (status === 'Active' || status === 'ACTIVE') {
      return t('status.active');
    }
    return status;
  };

  if (loading && !patient) {
    return (
      <RequireRole allowedRoles={['DOCTOR']} redirectTo="/login/doctor">
        <DoctorLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400"></div>
          </div>
        </DoctorLayout>
      </RequireRole>
    );
  }

  if (error || !patient) {
    return (
      <RequireRole allowedRoles={['DOCTOR']} redirectTo="/login/doctor">
        <DoctorLayout>
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error || t('errors.patientNotFound')}
            <button onClick={() => router.back()} className="ml-4 underline">{t('goBack')}</button>
          </div>
        </DoctorLayout>
      </RequireRole>
    );
  }

  return (
    <RequireRole allowedRoles={['DOCTOR']} redirectTo="/login/doctor">
      <DoctorLayout>
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-lg font-bold">
              {getInitials(patient.name)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-sm text-gray-600">
                {t('patientId', {id: patient.id})}
                {patient.queueNo ? ` • ${t('queue', {queue: patient.queueNo})}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveConsultation}
                className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] text-sm font-medium"
              >
                {t('saveConsultation')}
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              {patient.currentStatus !== 'COMPLETED' && (
                <button
                  onClick={async () => {
                    if (patient.currentAppointmentId && (patient.currentStatus === 'BOOKED' || patient.currentStatus === 'CHECKED_IN')) {
                      try {
                        await doctorApi.updateAppointmentStatus(patient.currentAppointmentId, 'CONSULTING');
                        setPatient({ ...patient, currentStatus: 'CONSULTING' });
                      } catch (err) {
                        console.error('Failed to update status:', err);
                      }
                    }
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#7fa8b8] text-sm font-medium"
                >
                  {patient.currentStatus === 'CONSULTING' ? t('continueConsultation') : t('startConsultation')}
                </button>
              )}
              {patient.currentAppointmentId && (patient.currentStatus === 'CONSULTING' || patient.currentStatus === 'CHECKED_IN') && (
                <button
                  onClick={async () => {
                    if (confirm(t('alerts.markComplete', { name: patient.name }))) {
                      try {
                        setLoading(true);
                        await doctorApi.updateAppointmentStatus(patient.currentAppointmentId!, 'COMPLETED');
                        alert(t('alerts.markedAsCompleted'));
                        router.push('/doctor/myPatients');
                      } catch (err: any) {
                        alert(err.message || 'Failed to complete consultation');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('markComplete')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Patient Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">{t('cards.age')}</p>
          <p className="text-lg font-bold text-gray-900">{t('cards.ageValue', {age: patient.age})}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">{t('cards.gender')}</p>
          <p className="text-lg font-bold text-gray-900">{patient.gender}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">{t('cards.bloodType')}</p>
          <p className="text-lg font-bold text-gray-900">{patient.bloodType}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">{t('cards.phone')}</p>
          <p className="text-sm font-medium text-gray-900">{patient.phone}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'overview'
              ? 'border-slate-400 text-slate-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {t('tabs.overview')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'history'
              ? 'border-slate-400 text-slate-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {t('tabs.medicalHistory')}
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'prescriptions'
              ? 'border-slate-400 text-slate-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {t('tabs.prescriptions')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Current Consultation */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('currentConsultation')}</h2>

                <div className="space-y-4">
                  {/* Vitals Input */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('vitals.bp')}</label>
                      <input
                        type="text"
                        value={vitals.bp}
                        onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50"
                        placeholder="120/80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('vitals.temp')}</label>
                      <input
                        type="text"
                        value={vitals.temp}
                        onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50"
                        placeholder="98.6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('vitals.pulse')}</label>
                      <input
                        type="text"
                        value={vitals.pulse}
                        onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50"
                        placeholder="72"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('vitals.weight')}</label>
                      <input
                        type="text"
                        value={vitals.weight}
                        onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50"
                        placeholder="70"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('diagnosis')}</label>
                    <textarea
                      value={currentDiagnosis}
                      onChange={(e) => setCurrentDiagnosis(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                      rows={3}
                      placeholder={t('diagnosisPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('consultationNotes')}</label>
                    <textarea
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                      rows={6}
                      placeholder={t('consultationNotesPlaceholder')}
                    />
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => setShowPrescriptionModal(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-slate-400 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {t('addPrescription')}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {patient.medicalHistory.map((record: any) => (
                <div key={record.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{record.diagnosis}</h3>
                      <p className="text-sm text-gray-600">{record.date} • {record.doctor}</p>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600">{t('vitals.bp')}</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals?.bp || t('notAvailable')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{t('vitals.tempShort')}</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals?.temp || t('notAvailable')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{t('vitals.pulse')}</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals?.pulse || t('notAvailable')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{t('vitals.weightShort')}</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals?.weight || t('notAvailable')}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">{t('notes')}:</p>
                    <p className="text-sm text-gray-600">{record.consultationNotes}</p>
                  </div>

                  {record.prescriptions && record.prescriptions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">{t('prescriptions')}:</p>
                      <div className="space-y-2">
                        {record.prescriptions.map((rx: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{rx.medicine}</p>
                              <p className="text-xs text-gray-600">{rx.dosage} • {rx.frequency}</p>
                            </div>
                            <span className="text-xs text-gray-500">{rx.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('activePrescriptions')}</h2>
                {isEditing && (
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('addNew')}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-slate-400 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{rx.medicine}</p>
                      <p className="text-sm text-gray-600">{rx.dosage} • {rx.frequency} • {rx.duration}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {getPrescriptionStatusLabel(rx.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Patient Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('patientDetails')}</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">{t('fields.email')}</p>
                <p className="font-medium text-gray-900">{patient.email}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('fields.address')}</p>
                <p className="font-medium text-gray-900">{patient.address}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('fields.emergencyContact')}</p>
                <p className="font-medium text-gray-900">{patient.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          {patient.allergies.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('allergies')}</h3>
              <div className="space-y-2">
                {patient.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm font-medium text-red-900">{allergy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronic Conditions */}
          {patient.chronicConditions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('chronicConditions')}</h3>
              <div className="space-y-2">
                {patient.chronicConditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <svg className="w-4 h-4 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-orange-900">{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('modal.addPrescription')}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.medicineName')}</label>
                <input
                  type="text"
                  value={newPrescription.medicine}
                  onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder={t('modal.medicinePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.dosage')}</label>
                <input
                  type="text"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder={t('modal.dosagePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.frequency')}</label>
                <input
                  type="text"
                  value={newPrescription.frequency}
                  onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder={t('modal.frequencyPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('modal.duration')}</label>
                <input
                  type="text"
                  value={newPrescription.duration}
                  onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder={t('modal.durationPlaceholder')}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddPrescription}
                disabled={!newPrescription.medicine || !newPrescription.dosage}
                className="flex-1 px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('addPrescription')}
              </button>
            </div>
          </div>
        </div>
      )}
      </DoctorLayout>
    </RequireRole>
  );
}
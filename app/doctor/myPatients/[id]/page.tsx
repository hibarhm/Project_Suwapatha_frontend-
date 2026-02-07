'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DoctorLayout from '@/app/components/doctorLayout';

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id;

  const [activeTab, setActiveTab] = useState('overview'); // overview, history, prescriptions
  const [isEditing, setIsEditing] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Sample patient data - in real app, fetch based on patientId
  const patientData = {
    1: { id: 1, queueNo: 'Q001', name: 'Alice Johnson', age: 45, gender: 'Female', bloodType: 'O+', phone: '+94 77 123 4567', email: 'alice.johnson@email.com', address: '123 Main Street, Colombo 07', emergencyContact: 'Bob Johnson (+94 77 987 6543)', allergies: ['Penicillin', 'Peanuts'], chronicConditions: ['Hypertension', 'Type 2 Diabetes'] },
    2: { id: 2, queueNo: 'Q002', name: 'Bob Williams', age: 52, gender: 'Male', bloodType: 'A+', phone: '+94 77 234 5678', email: 'bob.williams@email.com', address: '456 Lake Road, Colombo 05', emergencyContact: 'Sarah Williams (+94 77 876 5432)', allergies: ['Aspirin'], chronicConditions: ['Asthma'] },
    3: { id: 3, queueNo: 'Q003', name: 'Charlie Brown', age: 38, gender: 'Male', bloodType: 'B+', phone: '+94 77 345 6789', email: 'charlie.brown@email.com', address: '789 Park Avenue, Colombo 03', emergencyContact: 'Lucy Brown (+94 77 765 4321)', allergies: [], chronicConditions: [] },
  };

  const patientKey = typeof patientId === 'string' ? Number(patientId) : Array.isArray(patientId) ? Number(patientId[0]) : 1;
  const patient = patientData[patientKey as keyof typeof patientData] || patientData[1];

  const [currentNotes, setCurrentNotes] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState('');

  // Medical history
  const medicalHistory = [
    {
      id: 1,
      date: 'Jan 15, 2026',
      doctor: 'Dr. Priyantha Fernando',
      diagnosis: 'Hypertension - Follow up',
      notes: 'Blood pressure stable at 130/85. Continue current medication. Patient reports good compliance with diet.',
      prescriptions: [
        { medicine: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }
      ],
      vitals: { bp: '130/85', temp: '98.6°F', pulse: '72 bpm', weight: '75 kg' }
    },
    {
      id: 2,
      date: 'Dec 10, 2025',
      doctor: 'Dr. Priyantha Fernando',
      diagnosis: 'Routine Check-up',
      notes: 'All vitals normal. Patient reports feeling well. No complaints. Recommended annual blood work.',
      prescriptions: [],
      vitals: { bp: '128/82', temp: '98.4°F', pulse: '70 bpm', weight: '74 kg' }
    },
    {
      id: 3,
      date: 'Nov 20, 2025',
      doctor: 'Dr. Sumudu Kumari',
      diagnosis: 'Type 2 Diabetes Management',
      notes: 'HbA1c levels improving from 7.2% to 6.8%. Continue diet and exercise plan. Blood sugar well controlled.',
      prescriptions: [
        { medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
      ],
      vitals: { bp: '132/84', temp: '98.5°F', pulse: '74 bpm', weight: '76 kg' }
    }
  ];

  // Current prescriptions
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, medicine: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', status: 'Active' },
    { id: 2, medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', status: 'Active' }
  ]);

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
      alert('Prescription added successfully!');
    }
  };

  const handleSaveConsultation = () => {
    if (!currentDiagnosis || !currentNotes) {
      alert('Please enter diagnosis and consultation notes');
      return;
    }
    // Save current consultation
    alert('Consultation saved successfully!');
    setIsEditing(false);
    setCurrentDiagnosis('');
    setCurrentNotes('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
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
              <p className="text-sm text-gray-600">Patient ID: {patient.id} • Queue: {patient.queueNo}</p>
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
                Cancel
              </button>
              <button
                onClick={handleSaveConsultation}
                className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 text-sm font-medium"
              >
                Save Consultation
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 text-sm font-medium"
            >
              Start Consultation
            </button>
          )}
        </div>
      </div>

      {/* Patient Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Age</p>
          <p className="text-lg font-bold text-gray-900">{patient.age} years</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Gender</p>
          <p className="text-lg font-bold text-gray-900">{patient.gender}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Blood Type</p>
          <p className="text-lg font-bold text-gray-900">{patient.bloodType}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Phone</p>
          <p className="text-sm font-medium text-gray-900">{patient.phone}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-slate-400 text-slate-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'border-slate-400 text-slate-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Medical History
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'prescriptions'
                ? 'border-slate-400 text-slate-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Prescriptions
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Consultation</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                    <textarea
                      value={currentDiagnosis}
                      onChange={(e) => setCurrentDiagnosis(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                      rows={3}
                      placeholder="Enter diagnosis..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Notes</label>
                    <textarea
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm disabled:bg-gray-50 disabled:text-gray-600"
                      rows={6}
                      placeholder="Enter consultation notes, observations, recommendations..."
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
                      Add Prescription
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {medicalHistory.map((record) => (
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
                      <p className="text-xs text-gray-600">BP</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals.bp}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Temp</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals.temp}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Pulse</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals.pulse}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Weight</p>
                      <p className="text-sm font-medium text-gray-900">{record.vitals.weight}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600">{record.notes}</p>
                  </div>

                  {record.prescriptions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Prescriptions:</p>
                      <div className="space-y-2">
                        {record.prescriptions.map((rx, index) => (
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
                <h2 className="text-xl font-bold text-gray-900">Active Prescriptions</h2>
                {isEditing && (
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
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
                      {rx.status}
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Details</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{patient.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-medium text-gray-900">{patient.address}</p>
              </div>
              <div>
                <p className="text-gray-600">Emergency Contact</p>
                <p className="font-medium text-gray-900">{patient.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          {patient.allergies.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Allergies</h3>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Chronic Conditions</h3>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Prescription</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name *</label>
                <input
                  type="text"
                  value={newPrescription.medicine}
                  onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder="e.g., Amlodipine"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
                <input
                  type="text"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder="e.g., 5mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <input
                  type="text"
                  value={newPrescription.frequency}
                  onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder="e.g., Once daily"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={newPrescription.duration}
                  onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                  placeholder="e.g., 30 days"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPrescription}
                disabled={!newPrescription.medicine || !newPrescription.dosage}
                className="flex-1 px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </DoctorLayout>
  );
}
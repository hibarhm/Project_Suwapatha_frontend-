import API_BASE_URL from '../api';

export interface DoctorDashboardData {
    stats: {
        totalPatientsToday: number;
        consultationsThisWeek: number;
        averageWaitTime: number;
        changeFromYesterday: number;
        changeFromLastWeek: number;
        changeFromLastMonth: number;
    };
    upcomingAppointments: Array<{
        id: string;
        patientName: string;
        queueNo: string;
        time: string;
        avatar: string;
    }>;
    notifications: Array<{
        id: string;
        type: string;
        title: string;
        time: string;
        icon: string;
    }>;
    patientVisitsData: Array<{
        month: string;
        visits: number;
    }>;
    consultationsByDay: Array<{
        day: string;
        count: number;
    }>;
}

export interface DoctorAvailability {
    id: string;
    doctorId: string;
    doctorName: string;
    email: string;
    date: string;
    available: boolean;
    note: string;
    updatedAt: string | null;
}

export interface DoctorPatient {
    id: string;
    queueNo: string;
    name: string;
    gender: string;
    time: string;
    status: string;
    patientId: string;
}

export interface PatientDetails {
    id: string;
    name: string;
    age: string;
    gender: string;
    bloodType: string;
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
    allergies: string[];
    chronicConditions: string[];
    queueNo?: string;
    medicalHistory: Array<{
        id: string;
        visitDate: string;
        doctorName: string;
        diagnosis: string;
        consultationNotes: string;
        vitals: {
            bp: string;
            temp: string;
            pulse: string;
            weight: string;
        };
        prescriptions: Array<{
            medicine: string;
            dosage: string;
            frequency: string;
            duration: string;
            status: string;
        }>;
    }>;
    activePrescriptions: Array<{
        medicine: string;
        dosage: string;
        frequency: string;
        duration: string;
        status: string;
    }>;
}

export interface ConsultationRequest {
    patientId: string;
    diagnosis: string;
    consultationNotes: string;
    bp: string;
    temp: string;
    pulse: string;
    weight: string;
    prescriptions: Array<{
        medicine: string;
        dosage: string;
        frequency: string;
        duration: string;
        status: string;
    }>;
    followUpRequired: boolean;
}

export const doctorApi = {
    getDashboardData: async (): Promise<DoctorDashboardData> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Authentication token not found. Please log in again.');
        }

        const response = await fetch(`${API_BASE_URL}/api/doctor/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 403) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Access Denied: You do not have permission to view this dashboard. Please contact your administrator.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch dashboard data (Status: ${response.status})`);
        }

        return response.json();
    },

    getPatients: async (): Promise<DoctorPatient[]> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Authentication token not found. Please log in again.');
        }

        const response = await fetch(`${API_BASE_URL}/api/doctor/patients`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch patients (Status: ${response.status})`);
        }

        return response.json();
    },

    getPatientDetails: async (id: string): Promise<PatientDetails> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Authentication token not found.');
        }

        const response = await fetch(`${API_BASE_URL}/api/doctor/patients/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch patient details (Status: ${response.status})`);
        }

        return response.json();
    },

    saveConsultation: async (request: ConsultationRequest): Promise<void> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Authentication token not found.');
        }

        const response = await fetch(`${API_BASE_URL}/api/doctor/consultation`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to save consultation (Status: ${response.status})`);
        }
    },

    getAvailabilityToday: async (): Promise<DoctorAvailability> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token not found.');

        const response = await fetch(`${API_BASE_URL}/api/doctor/availability/today`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch availability status');
        }
        return response.json();
    },

    setAvailabilityToday: async (available: boolean, note: string = ''): Promise<DoctorAvailability> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication token not found.');

        const response = await fetch(`${API_BASE_URL}/api/doctor/availability/today`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ available, note }),
        });

        if (!response.ok) {
            throw new Error('Failed to update availability status');
        }
        return response.json();
    },
};

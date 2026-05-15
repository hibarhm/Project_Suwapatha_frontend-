import API_BASE_URL from '../api';

export interface Doctor {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    doctorId: string;
    specialty?: string; // Optional as it might not be in User response yet
    nic: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    createdAt: string;
}

export interface DoctorAvailability {
    id: string;
    doctorId: string;
    doctorName: string;
    email: string;
    date: string;
    available: boolean;
    note: string;
    room: string;
    updatedAt: string | null;
}

export const adminApi = {
    // ... existing methods (I'll keep them but I'm only showing the new ones in the replacement)
    getAllDoctors: async (): Promise<Doctor[]> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch doctors');
        }
        return response.json();
    },

    approveDoctor: async (id: string): Promise<Doctor> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${id}/approve`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to approve doctor');
        }
        return response.json();
    },

    rejectDoctor: async (id: string, reason?: string): Promise<Doctor> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${id}/reject`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: reason ? JSON.stringify({ reason }) : undefined,
        });

        if (!response.ok) {
            throw new Error('Failed to reject doctor');
        }
        return response.json();
    },

    getAvailableDoctorsToday: async (): Promise<DoctorAvailability[]> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/doctors/available-today`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch today\'s available doctors');
        }
        return response.json();
    },

    assignDoctorRoom: async (availabilityId: string, room: string): Promise<DoctorAvailability> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/availability/${availabilityId}/room`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to assign room to doctor');
        }
        return response.json();
    },

    allocatePatients: async (sessionId: string): Promise<void> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/sessions/${sessionId}/allocate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to allocate patients');
        }
    },

    createSession: async (data: {
        date: string;
        startTime: string;
        endTime: string;
        department: string;
        maxQueueSize: number;
        slotDuration: number;
    }): Promise<any> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/opd/sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create session');
        }
        return response.json();
    },
};

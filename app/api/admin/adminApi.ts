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

export const adminApi = {
    getAllDoctors: async (): Promise<Doctor[]> => {
        const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
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

    rejectDoctor: async (id: string): Promise<Doctor> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${id}/reject`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to reject doctor');
        }
        return response.json();
    }
};

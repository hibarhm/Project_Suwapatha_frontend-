import API_BASE_URL from '../api';
import { MedicalRecordResponse } from './medicalRecordTypes';

export const medicalRecordApi = {
  getAll: async (): Promise<MedicalRecordResponse[]> => {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/api/medical-records`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error('Failed to fetch medical records');
    }

    return response.json();
  }
};

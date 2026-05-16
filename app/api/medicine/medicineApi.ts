import API_BASE_URL from '../api';

export interface MedicineDTO {
    brandName: string;
    genericName: string;
    manufacturerName: string;
    dosageForm: string;
}

export const medicineApi = {
    searchMedicines: async (query: string): Promise<MedicineDTO[]> => {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Authentication token not found.');
        }

        if (query.length < 2) return [];

        const response = await fetch(`${API_BASE_URL}/api/doctor/medicines/search?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to search medicines (Status: ${response.status})`);
        }

        return response.json();
    }
};

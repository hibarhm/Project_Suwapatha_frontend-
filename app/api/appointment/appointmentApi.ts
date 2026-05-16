import { APPOINTMENT_ENDPOINTS } from './appointmentEndpoints';
import {
    HospitalResponse,
    NearbyHospitalResponse,
    OpdSessionResponse,
    AppointmentResponse,
    BookAppointmentRequest,
} from './appointmentTypes';

/** Reads the JWT from localStorage and builds Authorization header */
function authHeaders(): HeadersInit {
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || `Request failed: ${res.status}`);
    }
    if (res.status === 204) return undefined as unknown as T;
    return res.json() as Promise<T>;
}

export const appointmentApi = {
    /** Search hospitals. Pass empty string to get all. */
    getHospitals: async (search = ''): Promise<HospitalResponse[]> => {
        const url = search
            ? `${APPOINTMENT_ENDPOINTS.HOSPITALS}?search=${encodeURIComponent(search)}`
            : APPOINTMENT_ENDPOINTS.HOSPITALS;
        const res = await fetch(url, { headers: authHeaders() });
        return handleResponse<HospitalResponse[]>(res);
    },

    /** Get nearby hospitals based on lat/lng */
    getNearbyHospitals: async (lat: number, lng: number): Promise<NearbyHospitalResponse[]> => {
        const res = await fetch(APPOINTMENT_ENDPOINTS.NEARBY_HOSPITALS(lat, lng), {
            headers: authHeaders(),
        });
        return handleResponse<NearbyHospitalResponse[]>(res);
    },

    /** Upcoming OPEN sessions for a hospital */
    getSessions: async (hospitalId: string): Promise<OpdSessionResponse[]> => {
        const res = await fetch(APPOINTMENT_ENDPOINTS.HOSPITAL_SESSIONS(hospitalId), {
            headers: authHeaders(),
        });
        return handleResponse<OpdSessionResponse[]>(res);
    },

    /** Book a slot in a specific OPD session */
    book: async (data: BookAppointmentRequest): Promise<AppointmentResponse> => {
        const res = await fetch(APPOINTMENT_ENDPOINTS.BOOK, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse<AppointmentResponse>(res);
    },

    /** All appointments for the logged-in patient */
    getAll: async (): Promise<AppointmentResponse[]> => {
        const res = await fetch(APPOINTMENT_ENDPOINTS.GET_ALL, { headers: authHeaders() });
        return handleResponse<AppointmentResponse[]>(res);
    },

    /** Active (BOOKED) appointment — for the queue card */
    getActive: async (): Promise<AppointmentResponse | null> => {
        const res = await fetch(APPOINTMENT_ENDPOINTS.GET_ACTIVE, { headers: authHeaders() });
        if (res.status === 204) return null;
        return handleResponse<AppointmentResponse>(res);
    },

    /** Cancel an appointment */
    cancel: async (id: string): Promise<void> => {
        const res = await fetch(APPOINTMENT_ENDPOINTS.CANCEL(id), {
            method: 'DELETE',
            headers: authHeaders(),
        });
        return handleResponse<void>(res);
    },
};

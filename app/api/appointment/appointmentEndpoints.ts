import API_BASE_URL from '../api';

const BASE = API_BASE_URL;

export const APPOINTMENT_ENDPOINTS = {
    // Patient — hospitals
    HOSPITALS: `${BASE}/api/hospitals`,
    HOSPITAL_SESSIONS: (hospitalId: string) =>
        `${BASE}/api/hospitals/${hospitalId}/sessions`,

    // Patient — appointments
    BOOK: `${BASE}/api/patient/appointments/book`,
    GET_ALL: `${BASE}/api/patient/appointments`,
    GET_ACTIVE: `${BASE}/api/patient/appointments/active`,
    CANCEL: (id: string) => `${BASE}/api/patient/appointments/${id}`,
} as const;

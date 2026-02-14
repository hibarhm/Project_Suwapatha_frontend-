import API_BASE_URL from '../api';

export const authEndpoints = {
    REGISTER_PATIENT: `${API_BASE_URL}/api/auth/register/patient`,
    REGISTER_DOCTOR: `${API_BASE_URL}/api/auth/register/doctor`,
    LOGIN_PATIENT: `${API_BASE_URL}/api/auth/login/patient`,
    LOGIN_DOCTOR: `${API_BASE_URL}/api/auth/login/doctor`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
};

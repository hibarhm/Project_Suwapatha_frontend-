import API_BASE_URL from '../api';

export const authEndpoints = {
    REGISTER_PATIENT: `${API_BASE_URL}/api/auth/register/patient`,
    REGISTER_DOCTOR: `${API_BASE_URL}/api/auth/register/doctor`,
    LOGIN_PATIENT: `${API_BASE_URL}/api/auth/login/patient`,
    LOGIN_DOCTOR: `${API_BASE_URL}/api/auth/login/doctor`,
    LOGIN_ADMIN: `${API_BASE_URL}/api/auth/login/admin`,
    LOGIN_SUPER_ADMIN: `${API_BASE_URL}/api/auth/login/super-admin`,
    LOGIN_LABORATORY: `${API_BASE_URL}/api/auth/login/laboratory`,
};

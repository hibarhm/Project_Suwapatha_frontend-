import { authEndpoints } from './authEndpoints';
import {
    PatientRegisterRequest,
    DoctorRegisterRequest,
    PatientLoginRequest,
    DoctorLoginRequest,
    LoginRequest,
    AuthResponse,
} from './authTypes';

export class ApiError extends Error {
    constructor(
        public status: number,
        public error: string,
        message: string,
        public path: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json();
        throw new ApiError(
            error.status || response.status,
            error.error || 'Error',
            error.message || 'An error occurred',
            error.path || ''
        );
    }
    return response.json();
}

function persistAuth(result: AuthResponse) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result));
    // Convenience keys read by the dashboard
    localStorage.setItem('userName', `${result.firstName} ${result.lastName}`);
    localStorage.setItem('userEmail', result.email);
    localStorage.setItem('userId', result.id);
}

export const authApi = {
    registerPatient: async (data: PatientRegisterRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.REGISTER_PATIENT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        persistAuth(result);
        // Flag so the dashboard can show a first-login welcome message
        localStorage.setItem('isNewUser', 'true');
        return result;
    },

    registerDoctor: async (data: DoctorRegisterRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.REGISTER_DOCTOR, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        persistAuth(result);
        localStorage.setItem('isNewUser', 'true');
        return result;
    },

    loginPatient: async (data: PatientLoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN_PATIENT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        persistAuth(result);
        return result;
    },

    loginDoctor: async (data: DoctorLoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN_DOCTOR, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        persistAuth(result);
        return result;
    },


    loginAdmin: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN_ADMIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        persistAuth(result);
        return result;
    },

    loginSuperAdmin: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN_SUPER_ADMIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        persistAuth(result);
        return result;
    },

    loginLaboratory: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN_LABORATORY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        persistAuth(result);
        return result;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('isNewUser');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    getStoredUser: (): AuthResponse | null => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

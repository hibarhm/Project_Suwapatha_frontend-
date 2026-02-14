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

export const authApi = {
    registerPatient: async (data: PatientRegisterRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.REGISTER_PATIENT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result));
        return result;
    },

    registerDoctor: async (data: DoctorRegisterRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.REGISTER_DOCTOR, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result));
        return result;
    },

    loginPatient: async (data: PatientLoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN_PATIENT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result));
        return result;
    },

    loginDoctor: async (data: DoctorLoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN_DOCTOR, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result));
        return result;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result));
        return result;
    },

    loginAdmin: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(authEndpoints.LOGIN, { // Reusing general login endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await handleResponse<AuthResponse>(response);

        // Client-side verification for role (optional but good for UX)
        if (result.role !== 'ADMIN') {
            throw new Error('Unauthorized: Access restricted to administrators.');
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result));
        return result;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    getStoredUser: (): AuthResponse | null => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

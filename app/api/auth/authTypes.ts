export enum UserRole {
    PATIENT = 'PATIENT',
    DOCTOR = 'DOCTOR',
    ADMIN = 'ADMIN',
}

// Registration types
export interface PatientRegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    address: string;
    emergencyContact?: string;
}

export interface DoctorRegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    doctorId: string;
    nic: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
}

// Login types
export interface PatientLoginRequest {
    email: string;
    password: string;
}

export interface DoctorLoginRequest {
    doctorId: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Response types
export interface AuthResponse {
    token: string;
    type: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    expiresIn: number;
}

export interface ErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}

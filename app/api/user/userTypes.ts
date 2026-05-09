export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    dateOfBirth?: string;
    gender?: string;
    phoneNumber?: string;
    address?: string;
    emergencyContact?: string;
    createdAt?: string;
    hospitalId?: string;
    hospitalName?: string;
    status?: string;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    emergencyContact?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

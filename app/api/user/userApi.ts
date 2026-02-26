import API_BASE_URL from '@/app/api/api';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from './userTypes';

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
            const body = await res.json();
            msg = body.message ?? body.error ?? msg;
        } catch { /* ignore */ }
        throw new Error(msg);
    }
    return res.json();
}

export const userApi = {
    /** Fetch the current user's profile from the backend */
    getProfile: async (): Promise<UserProfile> => {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: getAuthHeaders(),
        });
        return handleResponse<UserProfile>(res);
    },

    /** Update profile fields and sync localStorage */
    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        const updated = await handleResponse<UserProfile>(res);

        // Keep localStorage in sync so dashboard shows updated name immediately
        const stored = (() => {
            try { return JSON.parse(localStorage.getItem('user') ?? 'null'); } catch { return null; }
        })();
        if (stored) {
            const merged = { ...stored, ...updated };
            localStorage.setItem('user', JSON.stringify(merged));
            localStorage.setItem('userName', `${merged.firstName} ${merged.lastName}`);
            localStorage.setItem('userEmail', merged.email);
        }

        return updated;
    },

    /** Change the current user's password */
    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/api/users/me/password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        await handleResponse<{ message: string }>(res);
    },
};

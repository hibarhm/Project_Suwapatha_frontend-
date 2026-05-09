import API_BASE_URL from '@/app/api/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
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
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}

/**
 * NOTE: Backend endpoints are centralized here so it’s easy to align
 * to the already-ready super-admin controllers.
 */
export const SUPER_ADMIN_ENDPOINTS = {
  // SUPER_ADMIN-only hospitals list (includes admin assignment info).
  HOSPITALS: `${API_BASE_URL}/api/super-admin/hospitals`,
  // SUPER_ADMIN can only create hospital-admin credentials.
  CREATE_HOSPITAL_ADMIN: (hospitalId: string) => `${API_BASE_URL}/api/super-admin/hospitals/${hospitalId}/admins`,
  UPDATE_HOSPITAL_ADMIN: (hospitalId: string) => `${API_BASE_URL}/api/super-admin/hospitals/${hospitalId}/admins`,
} as const;

export interface SuperAdminHospital {
  id: string;
  name: string;
  district?: string;
  province?: string;
  type?: string;
  address?: string;
  phone?: string;
  hasAdmin: boolean;
  admin?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface SuperAdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled?: boolean;
  hospitalId?: string;
  hospitalName?: string;
  createdAt?: string;
}

export const superAdminApi = {
  getHospitals: async (): Promise<SuperAdminHospital[]> => {
    const res = await fetch(SUPER_ADMIN_ENDPOINTS.HOSPITALS, {
      headers: getAuthHeaders(),
    });
    return handleResponse<SuperAdminHospital[]>(res);
  },

  createHospitalAdmin: async (hospitalId: string, data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<SuperAdminUser> => {
    const res = await fetch(SUPER_ADMIN_ENDPOINTS.CREATE_HOSPITAL_ADMIN(hospitalId), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SuperAdminUser>(res);
  },

  updateHospitalAdmin: async (hospitalId: string, data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
  }): Promise<SuperAdminUser> => {
    const res = await fetch(SUPER_ADMIN_ENDPOINTS.UPDATE_HOSPITAL_ADMIN(hospitalId), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SuperAdminUser>(res);
  },
};


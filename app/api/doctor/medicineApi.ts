import API_BASE_URL from '@/app/api/api';

// ── Types ────────────────────────────────────────────────────────────────────

/** Represents a single medicine result from the openFDA proxy. */
export interface MedicineResult {
  /** Unique identifier derived from the FDA application number. */
  id: string;
  /** Brand/trade name (e.g. "Tylenol"). May be null if FDA has no brand record. */
  brandName: string | null;
  /** International non-proprietary (generic) name (e.g. "acetaminophen"). */
  genericName: string | null;
  /** Drug manufacturer name. May be null. */
  manufacturer: string | null;
  /** Dosage form (e.g. "TABLET", "CAPSULE"). May be null. */
  dosageForm: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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
    } catch { /* ignore parse errors */ }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

// ── API ──────────────────────────────────────────────────────────────────────

export const medicineApi = {
  /**
   * Search medicines via the backend FDA proxy.
   * Returns an empty array on any error rather than throwing — the UI
   * handles error state separately via a try/catch.
   *
   * @param query search term (brand name, generic name, or active ingredient)
   * @param limit max results to return (default 10)
   */
  search: async (query: string, limit = 10): Promise<MedicineResult[]> => {
    const params = new URLSearchParams({ query, limit: String(limit) });
    const res = await fetch(
      `${API_BASE_URL}/api/doctor/medicines/search?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse<MedicineResult[]>(res);
  },
};

// Types matching the backend DTOs exactly

export interface HospitalResponse {
    id: string;
    name: string;
    district: string;
    province: string;
    type: string;
    address: string;
    phone: string;
    latitude?: number;
    longitude?: number;
}

export interface NearbyHospitalResponse extends HospitalResponse {
    distanceKm: number;
}

export interface OpdSessionResponse {
    id: string;
    hospitalId: string;
    hospitalName: string;
    date: string;         // yyyy-MM-dd
    startTime: string;    // HH:mm
    endTime: string;      // HH:mm
    department: string;
    doctorName: string;
    room: string;
    maxQueueSize: number;
    currentQueueCount: number;
    availableSlots: number;
    status: string;       // OPEN | FULL | CANCELLED
}

export interface AppointmentResponse {
    id: string;
    hospitalName: string;
    appointmentDate: string;
    queueNumber: number;
    doctorName: string;
    room: string;
    status: string;       // BOOKED | CANCELLED | COMPLETED | PENDING_ALLOCATION
    estimatedWaitMinutes: number;
    sessionStartTime: string; // HH:mm, session start time from OpdSession
    slotDuration: number;     // minutes per slot
    createdAt: string;
    isNext: boolean;

    // Allocation workflow fields
    allocationStatus?: string;
    assignedDoctorId?: string;
    finalQueueNumber?: string;
    queueNo?: string;
    estimatedConsultationTime?: string;
    allocatedAt?: string;
    liveQueueStatus?: string;
    priorityLevel?: number;
}

export interface BookAppointmentRequest {
    sessionId: string;
}

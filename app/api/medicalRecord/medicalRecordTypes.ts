export interface Prescription {
  name: string;
  dosage: string;
}

export interface MedicalRecordResponse {
  id: string;
  date: string;
  time: string;
  hospital: string;
  doctor: string;
  followUpRequired: boolean;
  diagnosis: string;
  consultationNotes: string;
  bp: string;
  temp: string;
  pulse: string;
  weight: string;
  prescriptions: Prescription[];
  labReports: number;
  labReportUrls?: string[];
}

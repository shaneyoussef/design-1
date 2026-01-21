export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ServiceType {
  REFILL = 'REFILL',
  UPLOAD = 'UPLOAD',
  TRANSFER = 'TRANSFER',
  CLINIC = 'CLINIC'
}

export interface PrescriptionAnalysis {
  medicationName?: string;
  dosage?: string;
  instructions?: string;
  confidence?: string;
}

// Vaccine Booking System Types

export type VaccineType = 'vial' | 'prefilled';
export type PoolStatus = 'filling' | 'open' | 'full' | 'completed';
export type SlotStatus = 'available' | 'reserved' | 'booked';
export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'moved' | 'no_response' | 'cancelled' | 'completed';
export type WaitlistStatus = 'waiting' | 'notified' | 'booked' | 'removed';
export type BookingType = 'pool' | 'slot';

export interface Vaccine {
  id: string;
  name: string;
  type: VaccineType;
  dosesPerVial: number; // Only relevant for vial type
  isActive: boolean;
  createdAt: Date;
}

export interface VaccineStock {
  id: string;
  vaccineId: string;
  totalStock: number;
  allocatedStock: number;
  updatedAt: Date;
}

export interface WalkInWindow {
  startTime: string; // HH:mm format
  endTime: string;
}

export interface ClinicDay {
  id: string;
  vaccineId: string;
  clinicDate: string; // YYYY-MM-DD format
  allocatedDoses: number;
  bookedDoses: number;
  walkInWindows: WalkInWindow[];
  isActive: boolean;
  createdAt: Date;
}

export interface Pool {
  id: string;
  vaccineId: string;
  status: PoolStatus;
  clinicDayId?: string;
  proposedDate?: string;
  confirmationDeadline?: Date;
  createdAt: Date;
}

export interface PoolMember {
  id: string;
  poolId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: BookingStatus;
  isOriginalMember: boolean;
  confirmationToken: string;
  joinedAt: Date;
  respondedAt?: Date;
}

export interface Slot {
  id: string;
  clinicDayId: string;
  slotNumber: number;
  status: SlotStatus;
  reservedUntil?: Date;
  bookingId?: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  vaccineId: string;
  clinicDayId: string;
  slotId?: string;
  poolMemberId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: BookingStatus;
  bookingType: BookingType;
  cancellationToken: string;
  createdAt: Date;
}

export interface WaitlistEntry {
  id: string;
  vaccineId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: WaitlistStatus;
  notifiedAt?: Date;
  createdAt: Date;
}

export interface PharmacySettings {
  pharmacyName: string;
  pharmacyEmail: string;
  pharmacyPhone: string;
  pharmacyAddress: string;
  updatedAt: Date;
}

// Form Data Types
export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  healthCardNumber?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  activePools: number;
  waitingPatients: number;
  totalStock: number;
  waitlistCount: number;
}

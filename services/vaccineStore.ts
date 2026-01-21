// Vaccine Booking System - Data Store with Local Storage Persistence
import type {
  Vaccine,
  VaccineStock,
  ClinicDay,
  Pool,
  PoolMember,
  Slot,
  Booking,
  WaitlistEntry,
  PharmacySettings,
  DashboardStats,
  PoolStatus,
  BookingStatus,
  SlotStatus,
} from '../types/vaccine';

// Generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 15);
const generateToken = (): string => Math.random().toString(36).substring(2, 30);

// Local Storage Keys
const STORAGE_KEYS = {
  vaccines: 'vaccine_booking_vaccines',
  stock: 'vaccine_booking_stock',
  clinicDays: 'vaccine_booking_clinic_days',
  pools: 'vaccine_booking_pools',
  poolMembers: 'vaccine_booking_pool_members',
  slots: 'vaccine_booking_slots',
  bookings: 'vaccine_booking_bookings',
  waitlist: 'vaccine_booking_waitlist',
  settings: 'vaccine_booking_settings',
  initialized: 'vaccine_booking_initialized',
};

// Default Pharmacy Settings
const defaultSettings: PharmacySettings = {
  pharmacyName: 'Medixly Pharmacy',
  pharmacyEmail: 'shenoudamesseha@gmail.com',
  pharmacyPhone: '416-731-3400',
  pharmacyAddress: '10 Denarius Cres, Richmond Hill, Toronto, ON',
  updatedAt: new Date(),
};

// Default Vaccines
const defaultVaccines: Vaccine[] = [
  {
    id: 'pfizer-vial',
    name: 'Pfizer COVID-19 (Vial)',
    type: 'vial',
    dosesPerVial: 6,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'moderna-vial',
    name: 'Moderna COVID-19 (Vial)',
    type: 'vial',
    dosesPerVial: 5,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'flu-standard',
    name: 'Flu Standard Dose',
    type: 'prefilled',
    dosesPerVial: 1,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'flu-high-dose',
    name: 'Flu High Dose (65+)',
    type: 'prefilled',
    dosesPerVial: 1,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'pfizer-prefilled',
    name: 'Pfizer COVID-19 (Pre-filled)',
    type: 'prefilled',
    dosesPerVial: 1,
    isActive: true,
    createdAt: new Date(),
  },
];

// Default Stock
const defaultStock: VaccineStock[] = [
  { id: 's1', vaccineId: 'pfizer-vial', totalStock: 60, allocatedStock: 24, updatedAt: new Date() },
  { id: 's2', vaccineId: 'moderna-vial', totalStock: 40, allocatedStock: 10, updatedAt: new Date() },
  { id: 's3', vaccineId: 'flu-standard', totalStock: 100, allocatedStock: 35, updatedAt: new Date() },
  { id: 's4', vaccineId: 'flu-high-dose', totalStock: 30, allocatedStock: 12, updatedAt: new Date() },
  { id: 's5', vaccineId: 'pfizer-prefilled', totalStock: 50, allocatedStock: 20, updatedAt: new Date() },
];

// Helper to get dates
const getDateString = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Default Clinic Days
const defaultClinicDays: ClinicDay[] = [
  {
    id: 'cd1',
    vaccineId: 'flu-standard',
    clinicDate: getDateString(2),
    allocatedDoses: 10,
    bookedDoses: 7,
    walkInWindows: [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '14:00', endTime: '17:00' },
    ],
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'cd2',
    vaccineId: 'flu-high-dose',
    clinicDate: getDateString(3),
    allocatedDoses: 8,
    bookedDoses: 3,
    walkInWindows: [{ startTime: '10:00', endTime: '14:00' }],
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'cd3',
    vaccineId: 'pfizer-prefilled',
    clinicDate: getDateString(4),
    allocatedDoses: 12,
    bookedDoses: 5,
    walkInWindows: [
      { startTime: '09:00', endTime: '11:00' },
      { startTime: '15:00', endTime: '18:00' },
    ],
    isActive: true,
    createdAt: new Date(),
  },
];

// Default Pools
const defaultPools: Pool[] = [
  {
    id: 'pool1',
    vaccineId: 'pfizer-vial',
    status: 'filling',
    createdAt: new Date(),
  },
  {
    id: 'pool2',
    vaccineId: 'moderna-vial',
    status: 'filling',
    createdAt: new Date(),
  },
];

// Default Pool Members
const defaultPoolMembers: PoolMember[] = [
  {
    id: 'pm1',
    poolId: 'pool1',
    patientName: 'John Smith',
    patientEmail: 'john@email.com',
    patientPhone: '416-555-0101',
    status: 'pending',
    isOriginalMember: true,
    confirmationToken: generateToken(),
    joinedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'pm2',
    poolId: 'pool1',
    patientName: 'Jane Doe',
    patientEmail: 'jane@email.com',
    patientPhone: '416-555-0102',
    status: 'pending',
    isOriginalMember: true,
    confirmationToken: generateToken(),
    joinedAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'pm3',
    poolId: 'pool1',
    patientName: 'Bob Wilson',
    patientEmail: 'bob@email.com',
    patientPhone: '416-555-0103',
    status: 'pending',
    isOriginalMember: true,
    confirmationToken: generateToken(),
    joinedAt: new Date(Date.now() - 10800000),
  },
  {
    id: 'pm4',
    poolId: 'pool1',
    patientName: 'Alice Brown',
    patientEmail: 'alice@email.com',
    patientPhone: '416-555-0104',
    status: 'pending',
    isOriginalMember: true,
    confirmationToken: generateToken(),
    joinedAt: new Date(Date.now() - 14400000),
  },
  {
    id: 'pm5',
    poolId: 'pool2',
    patientName: 'Tom Jones',
    patientEmail: 'tom@email.com',
    patientPhone: '416-555-0105',
    status: 'pending',
    isOriginalMember: true,
    confirmationToken: generateToken(),
    joinedAt: new Date(Date.now() - 1800000),
  },
  {
    id: 'pm6',
    poolId: 'pool2',
    patientName: 'Sarah Davis',
    patientEmail: 'sarah@email.com',
    patientPhone: '416-555-0106',
    status: 'pending',
    isOriginalMember: true,
    confirmationToken: generateToken(),
    joinedAt: new Date(Date.now() - 3600000),
  },
];

// Default Bookings
const defaultBookings: Booking[] = [
  {
    id: 'b1',
    vaccineId: 'flu-standard',
    clinicDayId: 'cd1',
    patientName: 'Mary Johnson',
    patientEmail: 'mary@email.com',
    patientPhone: '416-555-0201',
    status: 'confirmed',
    bookingType: 'slot',
    cancellationToken: generateToken(),
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'b2',
    vaccineId: 'flu-standard',
    clinicDayId: 'cd1',
    patientName: 'Peter Williams',
    patientEmail: 'peter@email.com',
    patientPhone: '416-555-0202',
    status: 'confirmed',
    bookingType: 'slot',
    cancellationToken: generateToken(),
    createdAt: new Date(Date.now() - 172800000),
  },
];

// Default Waitlist
const defaultWaitlist: WaitlistEntry[] = [
  {
    id: 'w1',
    vaccineId: 'flu-high-dose',
    patientName: 'Mike Brown',
    patientEmail: 'mike@email.com',
    patientPhone: '416-555-0301',
    status: 'waiting',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'w2',
    vaccineId: 'flu-high-dose',
    patientName: 'Lisa White',
    patientEmail: 'lisa@email.com',
    patientPhone: '416-555-0302',
    status: 'waiting',
    createdAt: new Date(Date.now() - 43200000),
  },
];

// Storage Helper Functions
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
  }
  return defaultValue;
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// Initialize Store
const initializeStore = (): void => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.initialized);
  if (!isInitialized) {
    saveToStorage(STORAGE_KEYS.vaccines, defaultVaccines);
    saveToStorage(STORAGE_KEYS.stock, defaultStock);
    saveToStorage(STORAGE_KEYS.clinicDays, defaultClinicDays);
    saveToStorage(STORAGE_KEYS.pools, defaultPools);
    saveToStorage(STORAGE_KEYS.poolMembers, defaultPoolMembers);
    saveToStorage(STORAGE_KEYS.slots, []);
    saveToStorage(STORAGE_KEYS.bookings, defaultBookings);
    saveToStorage(STORAGE_KEYS.waitlist, defaultWaitlist);
    saveToStorage(STORAGE_KEYS.settings, defaultSettings);
    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
  }
};

// Vaccine Store API
export const vaccineStore = {
  initialize: initializeStore,

  // Vaccines
  getVaccines: (): Vaccine[] => loadFromStorage(STORAGE_KEYS.vaccines, defaultVaccines),
  
  getActiveVaccines: (): Vaccine[] => {
    const vaccines = loadFromStorage<Vaccine[]>(STORAGE_KEYS.vaccines, defaultVaccines);
    return vaccines.filter((v) => v.isActive);
  },

  getVaccineById: (id: string): Vaccine | undefined => {
    const vaccines = loadFromStorage<Vaccine[]>(STORAGE_KEYS.vaccines, defaultVaccines);
    return vaccines.find((v) => v.id === id);
  },

  updateVaccine: (id: string, updates: Partial<Vaccine>): void => {
    const vaccines = loadFromStorage<Vaccine[]>(STORAGE_KEYS.vaccines, defaultVaccines);
    const index = vaccines.findIndex((v) => v.id === id);
    if (index !== -1) {
      vaccines[index] = { ...vaccines[index], ...updates };
      saveToStorage(STORAGE_KEYS.vaccines, vaccines);
    }
  },

  addVaccine: (vaccine: Omit<Vaccine, 'id' | 'createdAt'>): Vaccine => {
    const vaccines = loadFromStorage<Vaccine[]>(STORAGE_KEYS.vaccines, defaultVaccines);
    const newVaccine: Vaccine = {
      ...vaccine,
      id: generateId(),
      createdAt: new Date(),
    };
    vaccines.push(newVaccine);
    saveToStorage(STORAGE_KEYS.vaccines, vaccines);
    
    // Also create stock entry
    const stock = loadFromStorage<VaccineStock[]>(STORAGE_KEYS.stock, defaultStock);
    stock.push({
      id: generateId(),
      vaccineId: newVaccine.id,
      totalStock: 0,
      allocatedStock: 0,
      updatedAt: new Date(),
    });
    saveToStorage(STORAGE_KEYS.stock, stock);
    
    return newVaccine;
  },

  // Stock
  getStock: (): VaccineStock[] => loadFromStorage(STORAGE_KEYS.stock, defaultStock),
  
  getStockByVaccineId: (vaccineId: string): VaccineStock | undefined => {
    const stock = loadFromStorage<VaccineStock[]>(STORAGE_KEYS.stock, defaultStock);
    return stock.find((s) => s.vaccineId === vaccineId);
  },

  updateStock: (vaccineId: string, change: number): void => {
    const stock = loadFromStorage<VaccineStock[]>(STORAGE_KEYS.stock, defaultStock);
    const index = stock.findIndex((s) => s.vaccineId === vaccineId);
    if (index !== -1) {
      stock[index].totalStock = Math.max(0, stock[index].totalStock + change);
      stock[index].updatedAt = new Date();
      saveToStorage(STORAGE_KEYS.stock, stock);
    }
  },

  // Clinic Days
  getClinicDays: (): ClinicDay[] => loadFromStorage(STORAGE_KEYS.clinicDays, defaultClinicDays),
  
  getClinicDaysByVaccine: (vaccineId: string): ClinicDay[] => {
    const clinicDays = loadFromStorage<ClinicDay[]>(STORAGE_KEYS.clinicDays, defaultClinicDays);
    return clinicDays.filter((cd) => cd.vaccineId === vaccineId && cd.isActive);
  },

  getAvailableClinicDays: (vaccineId: string): ClinicDay[] => {
    const clinicDays = loadFromStorage<ClinicDay[]>(STORAGE_KEYS.clinicDays, defaultClinicDays);
    const today = new Date().toISOString().split('T')[0];
    return clinicDays.filter(
      (cd) =>
        cd.vaccineId === vaccineId &&
        cd.isActive &&
        cd.clinicDate >= today &&
        cd.bookedDoses < cd.allocatedDoses
    );
  },

  addClinicDay: (clinicDay: Omit<ClinicDay, 'id' | 'bookedDoses' | 'createdAt'>): ClinicDay => {
    const clinicDays = loadFromStorage<ClinicDay[]>(STORAGE_KEYS.clinicDays, defaultClinicDays);
    const newClinicDay: ClinicDay = {
      ...clinicDay,
      id: generateId(),
      bookedDoses: 0,
      createdAt: new Date(),
    };
    clinicDays.push(newClinicDay);
    saveToStorage(STORAGE_KEYS.clinicDays, clinicDays);
    return newClinicDay;
  },

  updateClinicDay: (id: string, updates: Partial<ClinicDay>): void => {
    const clinicDays = loadFromStorage<ClinicDay[]>(STORAGE_KEYS.clinicDays, defaultClinicDays);
    const index = clinicDays.findIndex((cd) => cd.id === id);
    if (index !== -1) {
      clinicDays[index] = { ...clinicDays[index], ...updates };
      saveToStorage(STORAGE_KEYS.clinicDays, clinicDays);
    }
  },

  deleteClinicDay: (id: string): void => {
    const clinicDays = loadFromStorage<ClinicDay[]>(STORAGE_KEYS.clinicDays, defaultClinicDays);
    const filtered = clinicDays.filter((cd) => cd.id !== id);
    saveToStorage(STORAGE_KEYS.clinicDays, filtered);
  },

  // Pools
  getPools: (): Pool[] => loadFromStorage(STORAGE_KEYS.pools, defaultPools),
  
  getActivePoolByVaccine: (vaccineId: string): Pool | undefined => {
    const pools = loadFromStorage<Pool[]>(STORAGE_KEYS.pools, defaultPools);
    return pools.find(
      (p) => p.vaccineId === vaccineId && (p.status === 'filling' || p.status === 'open')
    );
  },

  createPool: (vaccineId: string): Pool => {
    const pools = loadFromStorage<Pool[]>(STORAGE_KEYS.pools, defaultPools);
    const newPool: Pool = {
      id: generateId(),
      vaccineId,
      status: 'filling',
      createdAt: new Date(),
    };
    pools.push(newPool);
    saveToStorage(STORAGE_KEYS.pools, pools);
    return newPool;
  },

  updatePoolStatus: (poolId: string, status: PoolStatus, proposedDate?: string): void => {
    const pools = loadFromStorage<Pool[]>(STORAGE_KEYS.pools, defaultPools);
    const index = pools.findIndex((p) => p.id === poolId);
    if (index !== -1) {
      pools[index].status = status;
      if (proposedDate) {
        pools[index].proposedDate = proposedDate;
        pools[index].confirmationDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      saveToStorage(STORAGE_KEYS.pools, pools);
    }
  },

  // Pool Members
  getPoolMembers: (): PoolMember[] => loadFromStorage(STORAGE_KEYS.poolMembers, defaultPoolMembers),
  
  getPoolMembersByPool: (poolId: string): PoolMember[] => {
    const members = loadFromStorage<PoolMember[]>(STORAGE_KEYS.poolMembers, defaultPoolMembers);
    return members.filter((m) => m.poolId === poolId);
  },

  addPoolMember: (
    poolId: string,
    patientName: string,
    patientEmail: string,
    patientPhone: string,
    isOriginalMember: boolean = true
  ): PoolMember => {
    const members = loadFromStorage<PoolMember[]>(STORAGE_KEYS.poolMembers, defaultPoolMembers);
    const newMember: PoolMember = {
      id: generateId(),
      poolId,
      patientName,
      patientEmail,
      patientPhone,
      status: 'pending',
      isOriginalMember,
      confirmationToken: generateToken(),
      joinedAt: new Date(),
    };
    members.push(newMember);
    saveToStorage(STORAGE_KEYS.poolMembers, members);
    return newMember;
  },

  updatePoolMemberStatus: (memberId: string, status: BookingStatus): void => {
    const members = loadFromStorage<PoolMember[]>(STORAGE_KEYS.poolMembers, defaultPoolMembers);
    const index = members.findIndex((m) => m.id === memberId);
    if (index !== -1) {
      members[index].status = status;
      members[index].respondedAt = new Date();
      saveToStorage(STORAGE_KEYS.poolMembers, members);
    }
  },

  // Bookings
  getBookings: (): Booking[] => loadFromStorage(STORAGE_KEYS.bookings, defaultBookings),
  
  createBooking: (booking: Omit<Booking, 'id' | 'cancellationToken' | 'createdAt'>): Booking => {
    const bookings = loadFromStorage<Booking[]>(STORAGE_KEYS.bookings, defaultBookings);
    const newBooking: Booking = {
      ...booking,
      id: generateId(),
      cancellationToken: generateToken(),
      createdAt: new Date(),
    };
    bookings.push(newBooking);
    saveToStorage(STORAGE_KEYS.bookings, bookings);

    // Update clinic day booked doses
    const clinicDays = loadFromStorage<ClinicDay[]>(STORAGE_KEYS.clinicDays, defaultClinicDays);
    const cdIndex = clinicDays.findIndex((cd) => cd.id === booking.clinicDayId);
    if (cdIndex !== -1) {
      clinicDays[cdIndex].bookedDoses += 1;
      saveToStorage(STORAGE_KEYS.clinicDays, clinicDays);
    }

    return newBooking;
  },

  cancelBooking: (bookingId: string): void => {
    const bookings = loadFromStorage<Booking[]>(STORAGE_KEYS.bookings, defaultBookings);
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = 'cancelled';
      saveToStorage(STORAGE_KEYS.bookings, bookings);

      // Restore clinic day dose
      const clinicDays = loadFromStorage<ClinicDay[]>(STORAGE_KEYS.clinicDays, defaultClinicDays);
      const cdIndex = clinicDays.findIndex((cd) => cd.id === bookings[index].clinicDayId);
      if (cdIndex !== -1) {
        clinicDays[cdIndex].bookedDoses = Math.max(0, clinicDays[cdIndex].bookedDoses - 1);
        saveToStorage(STORAGE_KEYS.clinicDays, clinicDays);
      }
    }
  },

  // Waitlist
  getWaitlist: (): WaitlistEntry[] => loadFromStorage(STORAGE_KEYS.waitlist, defaultWaitlist),
  
  getWaitlistByVaccine: (vaccineId: string): WaitlistEntry[] => {
    const waitlist = loadFromStorage<WaitlistEntry[]>(STORAGE_KEYS.waitlist, defaultWaitlist);
    return waitlist.filter((w) => w.vaccineId === vaccineId && w.status === 'waiting');
  },

  addToWaitlist: (
    vaccineId: string,
    patientName: string,
    patientEmail: string,
    patientPhone: string
  ): WaitlistEntry => {
    const waitlist = loadFromStorage<WaitlistEntry[]>(STORAGE_KEYS.waitlist, defaultWaitlist);
    const newEntry: WaitlistEntry = {
      id: generateId(),
      vaccineId,
      patientName,
      patientEmail,
      patientPhone,
      status: 'waiting',
      createdAt: new Date(),
    };
    waitlist.push(newEntry);
    saveToStorage(STORAGE_KEYS.waitlist, waitlist);
    return newEntry;
  },

  removeFromWaitlist: (entryId: string): void => {
    const waitlist = loadFromStorage<WaitlistEntry[]>(STORAGE_KEYS.waitlist, defaultWaitlist);
    const index = waitlist.findIndex((w) => w.id === entryId);
    if (index !== -1) {
      waitlist[index].status = 'removed';
      saveToStorage(STORAGE_KEYS.waitlist, waitlist);
    }
  },

  // Settings
  getSettings: (): PharmacySettings => loadFromStorage(STORAGE_KEYS.settings, defaultSettings),
  
  updateSettings: (settings: Partial<PharmacySettings>): void => {
    const current = loadFromStorage<PharmacySettings>(STORAGE_KEYS.settings, defaultSettings);
    const updated = { ...current, ...settings, updatedAt: new Date() };
    saveToStorage(STORAGE_KEYS.settings, updated);
  },

  // Dashboard Stats
  getDashboardStats: (): DashboardStats => {
    const bookings = loadFromStorage<Booking[]>(STORAGE_KEYS.bookings, defaultBookings);
    const pools = loadFromStorage<Pool[]>(STORAGE_KEYS.pools, defaultPools);
    const poolMembers = loadFromStorage<PoolMember[]>(STORAGE_KEYS.poolMembers, defaultPoolMembers);
    const stock = loadFromStorage<VaccineStock[]>(STORAGE_KEYS.stock, defaultStock);
    const waitlist = loadFromStorage<WaitlistEntry[]>(STORAGE_KEYS.waitlist, defaultWaitlist);

    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(
      (b) => new Date(b.createdAt).toISOString().split('T')[0] === today
    ).length;

    const activePools = pools.filter((p) => p.status === 'filling' || p.status === 'open').length;
    const waitingPatients = poolMembers.filter((m) => m.status === 'pending').length;
    const totalStock = stock.reduce((sum, s) => sum + s.totalStock, 0);
    const waitlistCount = waitlist.filter((w) => w.status === 'waiting').length;

    return {
      totalBookings: bookings.filter((b) => b.status !== 'cancelled').length,
      todayBookings,
      activePools,
      waitingPatients,
      totalStock,
      waitlistCount,
    };
  },

  // Reset store (for testing)
  resetStore: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    initializeStore();
  },
};

// Initialize on import
vaccineStore.initialize();

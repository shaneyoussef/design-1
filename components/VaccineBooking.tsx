import React, { useState, useEffect } from 'react';
import { ClayCard, ClayButton, ClayInput } from './ClayComponents';
import { vaccineStore } from '../services/vaccineStore';
import type { Vaccine, ClinicDay, Pool, PatientFormData, WalkInWindow } from '../types/vaccine';
import { ArrowLeft, Syringe, Calendar, Clock, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface VaccineBookingProps {
  onBack: () => void;
}

type BookingStep = 'select-vaccine' | 'select-date' | 'patient-info' | 'confirmation' | 'pool-joined' | 'waitlist';

export const VaccineBooking: React.FC<VaccineBookingProps> = ({ onBack }) => {
  const [step, setStep] = useState<BookingStep>('select-vaccine');
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [clinicDays, setClinicDays] = useState<ClinicDay[]>([]);
  const [selectedClinicDay, setSelectedClinicDay] = useState<ClinicDay | null>(null);
  const [activePool, setActivePool] = useState<Pool | null>(null);
  const [patientData, setPatientData] = useState<PatientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    healthCardNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    message: string;
    bookingType?: 'slot' | 'pool' | 'waitlist';
  } | null>(null);

  useEffect(() => {
    const activeVaccines = vaccineStore.getActiveVaccines();
    setVaccines(activeVaccines);
  }, []);

  const handleVaccineSelect = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine);

    if (vaccine.type === 'vial') {
      // Check for active pool
      const pool = vaccineStore.getActivePoolByVaccine(vaccine.id);
      setActivePool(pool || null);

      if (pool?.status === 'open') {
        // Pool is open - instant booking available
        const days = vaccineStore.getAvailableClinicDays(vaccine.id);
        setClinicDays(days);
        setStep('select-date');
      } else {
        // Pool is filling or no pool - patient joins pool
        setStep('patient-info');
      }
    } else {
      // Pre-filled vaccine - slot-based booking
      const days = vaccineStore.getAvailableClinicDays(vaccine.id);
      const stock = vaccineStore.getStockByVaccineId(vaccine.id);

      if (days.length === 0 || (stock && stock.totalStock - stock.allocatedStock <= 0)) {
        // No availability - show waitlist option
        setStep('patient-info');
        setClinicDays([]);
      } else {
        setClinicDays(days);
        setStep('select-date');
      }
    }
  };

  const handleDateSelect = (clinicDay: ClinicDay) => {
    setSelectedClinicDay(clinicDay);
    setStep('patient-info');
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatWalkInWindows = (windows: WalkInWindow[]): string => {
    return windows.map((w) => `${formatTime(w.startTime)} - ${formatTime(w.endTime)}`).join(' • ');
  };

  const handleSubmit = async () => {
    if (!selectedVaccine) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fullName = `${patientData.firstName} ${patientData.lastName}`;

    if (selectedVaccine.type === 'vial') {
      if (activePool?.status === 'open' && selectedClinicDay) {
        // Instant booking for open pool
        vaccineStore.createBooking({
          vaccineId: selectedVaccine.id,
          clinicDayId: selectedClinicDay.id,
          patientName: fullName,
          patientEmail: patientData.email,
          patientPhone: patientData.phone,
          status: 'confirmed',
          bookingType: 'pool',
        });
        setBookingResult({
          success: true,
          message: 'Your vaccine appointment has been confirmed!',
          bookingType: 'slot',
        });
        setStep('confirmation');
      } else {
        // Join pool
        let pool = activePool;
        if (!pool) {
          pool = vaccineStore.createPool(selectedVaccine.id);
        }
        vaccineStore.addPoolMember(pool.id, fullName, patientData.email, patientData.phone, true);
        setBookingResult({
          success: true,
          message: "You've been added to the vaccine pool. We'll contact you within 48 hours with your appointment date.",
          bookingType: 'pool',
        });
        setStep('pool-joined');
      }
    } else {
      // Pre-filled vaccine
      if (selectedClinicDay) {
        // Slot booking
        vaccineStore.createBooking({
          vaccineId: selectedVaccine.id,
          clinicDayId: selectedClinicDay.id,
          patientName: fullName,
          patientEmail: patientData.email,
          patientPhone: patientData.phone,
          status: 'confirmed',
          bookingType: 'slot',
        });
        setBookingResult({
          success: true,
          message: 'Your vaccine appointment has been confirmed!',
          bookingType: 'slot',
        });
        setStep('confirmation');
      } else {
        // Join waitlist
        vaccineStore.addToWaitlist(selectedVaccine.id, fullName, patientData.email, patientData.phone);
        setBookingResult({
          success: true,
          message: "You've been added to the waitlist. We'll notify you when appointments become available.",
          bookingType: 'waitlist',
        });
        setStep('waitlist');
      }
    }

    setIsSubmitting(false);
  };

  const renderVaccineSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Select Your Vaccine</h2>
        <p className="text-gray-500">Choose the vaccine you'd like to receive</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vaccines.map((vaccine) => {
          const stock = vaccineStore.getStockByVaccineId(vaccine.id);
          const available = stock ? stock.totalStock - stock.allocatedStock : 0;
          const isOutOfStock = available <= 0 && vaccine.type === 'prefilled';

          return (
            <ClayCard
              key={vaccine.id}
              className={`p-6 cursor-pointer transition-all hover:-translate-y-1 ${
                isOutOfStock ? 'opacity-60' : ''
              }`}
              onClick={() => handleVaccineSelect(vaccine)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    vaccine.type === 'vial' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'
                  }`}
                >
                  <Syringe className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{vaccine.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {vaccine.type === 'vial' ? (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Pool-based booking
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Instant booking
                      </span>
                    )}
                  </p>
                  {isOutOfStock && (
                    <span className="inline-block mt-2 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                      Join Waitlist
                    </span>
                  )}
                </div>
              </div>
            </ClayCard>
          );
        })}
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Select Your Date</h2>
        <p className="text-gray-500">
          {selectedVaccine?.name} - Choose an available clinic day
        </p>
      </div>

      {clinicDays.length === 0 ? (
        <ClayCard className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-800 mb-2">No Available Dates</h3>
          <p className="text-gray-500 mb-6">
            All clinic days are currently fully booked. Join our waitlist to be notified when new slots open.
          </p>
          <ClayButton onClick={() => setStep('patient-info')}>Join Waitlist</ClayButton>
        </ClayCard>
      ) : (
        <div className="space-y-4">
          {clinicDays.map((day) => {
            const availableSlots = day.allocatedDoses - day.bookedDoses;
            const isFullyBooked = availableSlots <= 0;

            return (
              <ClayCard
                key={day.id}
                className={`p-6 ${
                  isFullyBooked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:-translate-y-1 transition-all'
                }`}
                onClick={() => !isFullyBooked && handleDateSelect(day)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <h3 className="font-bold text-lg text-gray-800">{formatDate(day.clinicDate)}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatWalkInWindows(day.walkInWindows)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {isFullyBooked ? (
                      <span className="text-red-500 font-bold">Fully Booked</span>
                    ) : (
                      <span className="text-green-600 font-bold">{availableSlots} spots available</span>
                    )}
                  </div>
                </div>
              </ClayCard>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPatientForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Your Information</h2>
        <p className="text-gray-500">
          {selectedVaccine?.type === 'vial' && !activePool?.status
            ? 'Join the vaccine pool'
            : selectedClinicDay
            ? `Booking for ${formatDate(selectedClinicDay.clinicDate)}`
            : 'Join the waitlist'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2">First Name *</label>
          <ClayInput
            placeholder="John"
            value={patientData.firstName}
            onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2">Last Name *</label>
          <ClayInput
            placeholder="Smith"
            value={patientData.lastName}
            onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">Email Address *</label>
        <ClayInput
          type="email"
          placeholder="john@example.com"
          value={patientData.email}
          onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">Phone Number *</label>
        <ClayInput
          type="tel"
          placeholder="416-555-0123"
          value={patientData.phone}
          onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">Date of Birth *</label>
        <ClayInput
          type="date"
          value={patientData.dateOfBirth}
          onChange={(e) => setPatientData({ ...patientData, dateOfBirth: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">Health Card Number (Optional)</label>
        <ClayInput
          placeholder="1234-567-890-XX"
          value={patientData.healthCardNumber}
          onChange={(e) => setPatientData({ ...patientData, healthCardNumber: e.target.value })}
        />
      </div>

      <ClayButton
        className="w-full py-4 text-lg mt-6"
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          !patientData.firstName ||
          !patientData.lastName ||
          !patientData.email ||
          !patientData.phone ||
          !patientData.dateOfBirth
        }
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : selectedClinicDay ? (
          'Confirm Booking'
        ) : selectedVaccine?.type === 'vial' ? (
          'Join Vaccine Pool'
        ) : (
          'Join Waitlist'
        )}
      </ClayButton>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500">{bookingResult?.message}</p>
      </div>

      {selectedClinicDay && (
        <ClayCard className="p-6 text-left">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Syringe className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600">{selectedVaccine?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600">{formatDate(selectedClinicDay.clinicDate)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600">{formatWalkInWindows(selectedClinicDay.walkInWindows)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 bg-blue-50 p-3 rounded-xl">
            Walk in anytime during these hours - no specific time slot needed!
          </p>
        </ClayCard>
      )}

      <p className="text-sm text-gray-500">A confirmation email has been sent to {patientData.email}</p>

      <ClayButton className="px-8 py-3" onClick={onBack}>
        Return Home
      </ClayButton>
    </div>
  );

  const renderPoolJoined = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
        <Users className="w-10 h-10 text-blue-600" />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">You're in the Pool!</h2>
        <p className="text-gray-500">{bookingResult?.message}</p>
      </div>

      <ClayCard className="p-6 text-left">
        <h3 className="font-bold text-lg text-gray-800 mb-4">What Happens Next?</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
              1
            </div>
            <p className="text-gray-600">
              We'll group you with other patients to minimize vaccine waste
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
              2
            </div>
            <p className="text-gray-600">
              Within 48 hours, you'll receive an email with your proposed appointment date
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
              3
            </div>
            <p className="text-gray-600">
              You'll have 24 hours to confirm, reschedule, or decline
            </p>
          </div>
        </div>
      </ClayCard>

      <p className="text-sm text-gray-500">Check your email at {patientData.email} for updates</p>

      <ClayButton className="px-8 py-3" onClick={onBack}>
        Return Home
      </ClayButton>
    </div>
  );

  const renderWaitlist = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
        <AlertCircle className="w-10 h-10 text-orange-600" />
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Added to Waitlist</h2>
        <p className="text-gray-500">{bookingResult?.message}</p>
      </div>

      <ClayCard className="p-6 text-left">
        <h3 className="font-bold text-lg text-gray-800 mb-4">What Happens Next?</h3>
        <p className="text-gray-600">
          When {selectedVaccine?.name} becomes available, all waitlist members will be notified simultaneously.
          Spots are offered on a first-come, first-served basis, so book quickly when you receive the notification!
        </p>
      </ClayCard>

      <p className="text-sm text-gray-500">We'll notify you at {patientData.email}</p>

      <ClayButton className="px-8 py-3" onClick={onBack}>
        Return Home
      </ClayButton>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'select-vaccine':
        return renderVaccineSelection();
      case 'select-date':
        return renderDateSelection();
      case 'patient-info':
        return renderPatientForm();
      case 'confirmation':
        return renderConfirmation();
      case 'pool-joined':
        return renderPoolJoined();
      case 'waitlist':
        return renderWaitlist();
      default:
        return null;
    }
  };

  const canGoBack = () => {
    return ['select-date', 'patient-info'].includes(step);
  };

  const handleBack = () => {
    if (step === 'select-date') {
      setSelectedVaccine(null);
      setStep('select-vaccine');
    } else if (step === 'patient-info') {
      if (selectedClinicDay) {
        setSelectedClinicDay(null);
        setStep('select-date');
      } else {
        setSelectedVaccine(null);
        setStep('select-vaccine');
      }
    }
  };

  return (
    <div className="min-h-screen bg-clay-bg p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ClayButton
            variant="secondary"
            className="!p-3"
            onClick={canGoBack() ? handleBack : onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </ClayButton>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Vaccine Booking</h1>
            <p className="text-sm text-gray-500">Medixly Pharmacy</p>
          </div>
        </div>

        {/* Progress Indicator */}
        {!['confirmation', 'pool-joined', 'waitlist'].includes(step) && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'select-vaccine' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
            <div className="w-8 h-0.5 bg-gray-300" />
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'select-date' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
            <div className="w-8 h-0.5 bg-gray-300" />
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'patient-info' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          </div>
        )}

        {/* Main Content */}
        <ClayCard className="p-6 md:p-8">{renderStepContent()}</ClayCard>
      </div>
    </div>
  );
};

export default VaccineBooking;

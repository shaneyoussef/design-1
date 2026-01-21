import React, { useState } from 'react';
import { ClayCard, ClayButton, ClayInput, ClaySelect } from './ClayComponents';
import { ArrowLeft, Plus, Trash2, Truck } from 'lucide-react';

interface Medication {
  id: number;
  prescriptionNumber: string;
  medicationName: string;
}

interface TransferFormProps {
  onBack: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({ onBack }) => {
  // Pharmacy Information
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  
  // Patient Information
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  // Transfer Type
  const [transferType, setTransferType] = useState('entire');
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, prescriptionNumber: '', medicationName: '' }
  ]);
  
  // Consent
  const [consentToMessages, setConsentToMessages] = useState(false);
  const [contactMethod, setContactMethod] = useState('Cell Phone (SMS)');
  const [contactValue, setContactValue] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), prescriptionNumber: '', medicationName: '' }
    ]);
  };

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter(m => m.id !== id));
    }
  };

  const updateMedication = (id: number, field: 'prescriptionNumber' | 'medicationName', value: string) => {
    setMedications(medications.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Pharmacy validation
    if (!pharmacyName.trim()) newErrors.pharmacyName = 'Pharmacy name is required';
    if (!pharmacyPhone.trim()) newErrors.pharmacyPhone = 'Pharmacy phone number is required';
    
    // Patient validation
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    
    // Specific medications validation
    if (transferType === 'specific') {
      medications.forEach((med) => {
        if (!med.prescriptionNumber.trim() && !med.medicationName.trim()) {
          newErrors[`medication_${med.id}`] = 'Enter prescription number or medication name';
        }
      });
    }

    if (consentToMessages && !contactValue.trim()) {
      newErrors.contactValue = 'Contact information is required when consent is given';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Transfer request submitted successfully! We will handle the transfer and contact you shortly.');
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#f0f4f8]">
      {/* Header */}
      <header className="p-4 md:p-6 sticky top-0 z-40">
        <nav className="bg-clay-bg rounded-[35px] shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">M</div>
            Medixly
          </div>
          <div className="w-16"></div>
        </nav>
      </header>

      {/* Form Section */}
      <section className="px-4 md:px-12 py-6 max-w-3xl mx-auto">
        <ClayCard className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center shadow-inner text-green-600">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-700">Transfer Prescription</h1>
              <p className="text-gray-500 mt-1">Transfer your prescription from another pharmacy to Old Park Pharmacy.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Pharmacy Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-2">Current Pharmacy Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Pharmacy Name *</label>
                <ClayInput 
                  placeholder="Enter current pharmacy name"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                />
                {errors.pharmacyName && <p className="text-red-500 text-sm mt-1">{errors.pharmacyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Pharmacy Phone Number *</label>
                <ClayInput 
                  placeholder="Enter pharmacy phone number"
                  type="tel"
                  value={pharmacyPhone}
                  onChange={(e) => setPharmacyPhone(e.target.value)}
                />
                {errors.pharmacyPhone && <p className="text-red-500 text-sm mt-1">{errors.pharmacyPhone}</p>}
              </div>
            </div>

            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-2">Patient Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name *</label>
                <ClayInput 
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number *</label>
                <ClayInput 
                  placeholder="Enter your phone number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth *</label>
                <ClayInput 
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
            </div>

            {/* Transfer Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-2">Transfer Type</h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl bg-white/50 border border-white/50 hover:bg-white/70 transition-colors">
                  <input 
                    type="radio"
                    name="transferType"
                    value="entire"
                    checked={transferType === 'entire'}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-gray-700">Transfer Entire Profile</span>
                    <p className="text-sm text-gray-500">Transfer all prescriptions from the other pharmacy</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl bg-white/50 border border-white/50 hover:bg-white/70 transition-colors">
                  <input 
                    type="radio"
                    name="transferType"
                    value="specific"
                    checked={transferType === 'specific'}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-gray-700">Transfer Specific Prescriptions</span>
                    <p className="text-sm text-gray-500">Select specific medications to transfer</p>
                  </div>
                </label>
              </div>

              {transferType === 'specific' && (
                <div className="space-y-4 mt-4 animate-fade-in">
                  {medications.map((med, index) => (
                    <div key={med.id} className="bg-white/50 p-4 rounded-2xl border border-white/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">Medication {index + 1}</span>
                        {medications.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeMedication(med.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <ClayInput 
                        placeholder="Prescription Number (Rx#)"
                        value={med.prescriptionNumber}
                        onChange={(e) => updateMedication(med.id, 'prescriptionNumber', e.target.value)}
                      />
                      <div className="text-center text-gray-400 text-sm">or</div>
                      <ClayInput 
                        placeholder="Medication Name"
                        value={med.medicationName}
                        onChange={(e) => updateMedication(med.id, 'medicationName', e.target.value)}
                      />
                      {errors[`medication_${med.id}`] && (
                        <p className="text-red-500 text-sm">{errors[`medication_${med.id}`]}</p>
                      )}
                    </div>
                  ))}

                  <ClayButton 
                    type="button" 
                    variant="secondary" 
                    className="w-full py-3"
                    onClick={addMedication}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Medication
                  </ClayButton>
                </div>
              )}
            </div>

            {/* Consent Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-2">Communication Preferences</h3>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={consentToMessages}
                  onChange={(e) => setConsentToMessages(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-600">I consent to receive messages about my transfer status</span>
              </label>

              {consentToMessages && (
                <div className="ml-8 space-y-3 animate-fade-in">
                  <ClaySelect 
                    options={['Cell Phone (SMS)', 'Email']}
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                  />
                  <ClayInput 
                    placeholder={contactMethod === 'Email' ? 'Enter your email address' : 'Enter your cell phone number'}
                    type={contactMethod === 'Email' ? 'email' : 'tel'}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                  />
                  {errors.contactValue && <p className="text-red-500 text-sm">{errors.contactValue}</p>}
                </div>
              )}
            </div>

            <ClayButton type="submit" className="w-full py-4 text-lg mt-8">
              Submit Transfer Request
            </ClayButton>
          </form>
        </ClayCard>
      </section>
    </div>
  );
};

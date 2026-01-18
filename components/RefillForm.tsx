import React, { useState } from 'react';
import { ClayCard, ClayButton, ClayInput, ClaySelect } from './ClayComponents';
import { ArrowLeft, Plus, Trash2, Recycle } from 'lucide-react';

interface Medication {
  id: number;
  prescriptionNumber: string;
  medicationName: string;
}

interface RefillFormProps {
  onBack: () => void;
}

export const RefillForm: React.FC<RefillFormProps> = ({ onBack }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('Pick up at Store');
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, prescriptionNumber: '', medicationName: '' }
  ]);
  const [consentToMessages, setConsentToMessages] = useState(false);
  const [contactMethod, setContactMethod] = useState('');
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
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    medications.forEach((med, index) => {
      if (!med.prescriptionNumber.trim() && !med.medicationName.trim()) {
        newErrors[`medication_${med.id}`] = 'Enter prescription number or medication name';
      }
    });

    if (consentToMessages && !contactValue.trim()) {
      newErrors.contactValue = 'Contact information is required when consent is given';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Refill request submitted successfully! We will contact you shortly.');
      // Reset form or redirect
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
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shadow-inner text-blue-600">
              <Recycle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-700">Refill Prescription</h1>
              <p className="text-gray-500 mt-1">Running low? Refill your existing medications quickly and easily.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-2">Personal Information</h3>
              
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
                <label className="block text-sm font-medium text-gray-600 mb-2">Delivery Option *</label>
                <ClaySelect 
                  options={['Pick up at Store', 'Local Delivery']}
                  value={deliveryOption}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
              </div>
            </div>

            {/* Medications */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-2">Medications</h3>
              
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
                <span className="text-gray-600">I consent to receive messages about my prescription status</span>
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
              Submit Refill Request
            </ClayButton>
          </form>
        </ClayCard>
      </section>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { ClayCard, ClayButton, ClayInput, ClaySelect } from './ClayComponents';
import { ArrowLeft, Upload, Camera, X, ShieldCheck } from 'lucide-react';

interface UploadFormProps {
  onBack: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onBack }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('Pick up at Store');
  const [notes, setNotes] = useState('');
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [consentToMessages, setConsentToMessages] = useState(false);
  const [contactMethod, setContactMethod] = useState('Cell Phone (SMS)');
  const [contactValue, setContactValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPrescriptionImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!prescriptionImage) newErrors.image = 'Please upload or take a photo of your prescription';
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';

    if (consentToMessages && !contactValue.trim()) {
      newErrors.contactValue = 'Contact information is required when consent is given';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Prescription submitted successfully! We will process it and contact you shortly.');
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
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center shadow-inner text-purple-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-700">Submit New Prescription</h1>
              <p className="text-gray-500 mt-1">Have a new script? Upload a photo or scan of your prescription.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prescription Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-600 border-b border-gray-200 pb-2">Prescription Image *</h3>
              
              {!prescriptionImage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Section */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-48 border-2 border-dashed border-blue-200 rounded-[20px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-gray-500 font-medium">Upload File</p>
                    <p className="text-sm text-gray-400 mt-1">Click to browse</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {/* Camera Section */}
                  <div 
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-48 border-2 border-dashed border-purple-200 rounded-[20px] flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-gray-500 font-medium">Take Photo</p>
                    <p className="text-sm text-gray-400 mt-1">Use your camera</p>
                    <input 
                      type="file" 
                      ref={cameraInputRef} 
                      className="hidden" 
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={prescriptionImage} 
                    alt="Prescription" 
                    className="w-full h-64 object-contain rounded-[20px] bg-white border border-gray-100" 
                  />
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Notes (Optional)</label>
                <textarea 
                  className="bg-clay-bg rounded-[15px] shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] border-none p-4 w-full outline-none text-clay-text placeholder-gray-400 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Any special instructions or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
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
              Submit Prescription
            </ClayButton>
          </form>
        </ClayCard>
      </section>
    </div>
  );
};

import React, { useEffect } from 'react';
import { ClayCard } from './ClayComponents';
import { ArrowLeft, Upload } from 'lucide-react';

interface UploadFormProps {
  onBack: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onBack }) => {
  useEffect(() => {
    // Load JotForm embed handler script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.jotformEmbedHandler) {
        // @ts-ignore
        window.jotformEmbedHandler(
          "iframe[id='JotFormIFrame-260175352915053']",
          'https://form.jotform.com/'
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      <section className="px-4 md:px-12 py-6 max-w-4xl mx-auto">
        <ClayCard className="p-6 md:p-8 overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center shadow-inner text-green-600">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Submit New Prescription</h1>
              <p className="text-gray-500 text-sm md:text-base mt-1">Upload a photo of your prescription and we'll take care of the rest.</p>
            </div>
          </div>

          {/* JotForm Embed */}
          <div 
            className="rounded-[25px] overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #f5f9fc, #e8eff5)',
              boxShadow: 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff',
              padding: '4px',
            }}
          >
            <iframe
              id="JotFormIFrame-260175352915053"
              title="Submit New Prescription"
              onLoad={() => window.parent.scrollTo(0, 0)}
              allow="geolocation; microphone; camera; fullscreen"
              src="https://form.jotform.com/260175352915053"
              frameBorder="0"
              style={{
                minWidth: '100%',
                maxWidth: '100%',
                height: '900px',
                border: 'none',
                borderRadius: '21px',
                background: 'transparent',
              }}
              scrolling="no"
            />
          </div>
        </ClayCard>
        
        {/* Additional Info Card */}
        <ClayCard className="p-6 mt-6 bg-green-50/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-lg">📷</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-1">Tips for Uploading</h3>
              <ul className="text-gray-500 text-sm space-y-1">
                <li>• Make sure the prescription is clearly visible</li>
                <li>• Include all pages of the prescription</li>
                <li>• Accepted formats: JPG, PNG, PDF, HEIC</li>
              </ul>
            </div>
          </div>
        </ClayCard>

        {/* Help Card */}
        <ClayCard className="p-6 mt-6 bg-blue-50/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-lg">💬</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-1">Need Help?</h3>
              <p className="text-gray-500 text-sm">
                If you have questions or need assistance, call us at{' '}
                <a href="tel:416-731-3400" className="text-blue-600 font-bold hover:underline">
                  416-731-3400
                </a>
              </p>
            </div>
          </div>
        </ClayCard>
      </section>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { ClayCard } from './ClayComponents';
import { ArrowLeft, Recycle } from 'lucide-react';

interface RefillFormProps {
  onBack: () => void;
}

export const RefillForm: React.FC<RefillFormProps> = ({ onBack }) => {
  const [iframeHeight, setIframeHeight] = useState(700);

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
          "iframe[id='JotFormIFrame-260174867483063']",
          'https://form.jotform.com/'
        );
      }
    };

    // Handle iframe resize messages from JotForm
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://form.jotform.com') {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data.action === 'setHeight' && data.height) {
            setIframeHeight(data.height + 50);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans bg-[#f0f4f8]">
      {/* Header */}
      <header className="p-4 md:p-6 sticky top-0 z-40">
        <nav className="bg-clay-bg rounded-[25px] md:rounded-[35px] shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] flex justify-between items-center px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 md:gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back
          </button>
          <div className="text-xl md:text-2xl font-bold text-blue-600 flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs md:text-sm">M</div>
            Medixly
          </div>
          <div className="w-12 md:w-16"></div>
        </nav>
      </header>

      {/* Form Section */}
      <section className="px-3 md:px-12 py-4 md:py-6 max-w-4xl mx-auto">
        <ClayCard className="p-4 md:p-8 overflow-hidden">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-100 flex items-center justify-center shadow-inner text-blue-600 flex-shrink-0">
              <Recycle className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-700">Refill Prescription</h1>
              <p className="text-gray-500 text-xs md:text-base mt-1">Running low? Refill your existing medications quickly and easily.</p>
            </div>
          </div>

          {/* JotForm Embed - Mobile Responsive */}
          <div 
            className="rounded-[15px] md:rounded-[25px] overflow-hidden -mx-2 md:mx-0"
            style={{
              background: 'linear-gradient(145deg, #f5f9fc, #e8eff5)',
              boxShadow: 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
              padding: '2px',
            }}
          >
            <iframe
              id="JotFormIFrame-260174867483063"
              title="Refill Prescription Request"
              onLoad={() => window.parent.scrollTo(0, 0)}
              allow="geolocation; microphone; camera; fullscreen"
              src="https://form.jotform.com/260174867483063"
              frameBorder="0"
              style={{
                width: '100%',
                minHeight: `${iframeHeight}px`,
                border: 'none',
                borderRadius: '13px',
                background: 'transparent',
              }}
              scrolling="yes"
            />
          </div>
        </ClayCard>
        
        {/* Additional Info Card */}
        <ClayCard className="p-4 md:p-6 mt-4 md:mt-6 bg-blue-50/50">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-base md:text-lg">💊</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-700 mb-1 text-sm md:text-base">Need Help?</h3>
              <p className="text-gray-500 text-xs md:text-sm">
                If you have questions about your refill or need assistance, call us at{' '}
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

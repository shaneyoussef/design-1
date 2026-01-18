import React, { useState } from 'react';
import { ClayCard, ClayButton, ClayInput, ClaySelect } from './components/ClayComponents';
import { ChatAssistant } from './components/ChatAssistant';
import { PrescriptionUpload } from './components/PrescriptionUpload';
import { Phone, MapPin, Mail, Clock, ShieldCheck, Truck, Recycle } from 'lucide-react';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">
      
      {/* Header */}
      <header className="p-4 md:p-6 sticky top-0 z-40 pointer-events-none">
        <nav className="clay-card pointer-events-auto bg-clay-bg rounded-[35px] shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">M</div>
            Medixly
          </div>
          
          <div className="hidden md:flex gap-8 font-bold text-gray-500">
            <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
            <a href="#services" className="hover:text-blue-500 transition-colors">Prescription</a>
            <a href="#clinic" className="hover:text-blue-500 transition-colors">Clinic</a>
            <a href="#about" className="hover:text-blue-500 transition-colors">Services</a>
            <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
          </div>

          <ClayButton className="md:hidden !p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             <div className="space-y-1">
                <div className="w-6 h-0.5 bg-blue-500"></div>
                <div className="w-6 h-0.5 bg-blue-500"></div>
                <div className="w-6 h-0.5 bg-blue-500"></div>
             </div>
          </ClayButton>
        </nav>
        
        {mobileMenuOpen && (
            <div className="absolute top-24 left-4 right-4 z-50 pointer-events-auto">
                <ClayCard className="flex flex-col gap-4 p-6 items-center font-bold text-gray-600">
                    <a href="#" onClick={() => setMobileMenuOpen(false)}>Home</a>
                    <a href="#services" onClick={() => setMobileMenuOpen(false)}>Prescription</a>
                    <a href="#clinic" onClick={() => setMobileMenuOpen(false)}>Clinic</a>
                    <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                </ClayCard>
            </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="px-4 md:px-12 py-6">
        <ClayCard className="p-8 md:p-24 text-center max-w-7xl mx-auto relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-800 relative z-10">Wellness, Sculpted for You.</h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-600 leading-relaxed relative z-10">
            Experience a pharmacy that feels as soft and supportive as your community. We combine modern AI-enhanced care with a gentle, personal touch.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center relative z-10">
             <a href="tel:416-731-3400">
                <ClayButton className="px-10 py-4 text-xl group">
                    <Phone className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Call Now: 416-731-3400
                </ClayButton>
             </a>
             <ClayButton variant="secondary" className="px-10 py-4 text-xl">
                 Book Appointment
             </ClayButton>
          </div>
        </ClayCard>
      </section>

      {/* Main Services Grid */}
      <section id="services" className="p-4 md:p-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Refill Card */}
          <ClayCard className="p-8 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 shadow-inner text-blue-600">
                <Recycle />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Refill Prescription</h3>
            <p className="mb-6 text-gray-500">Running low? Refill your medications quickly and easily with just your Rx number.</p>
            <div className="space-y-4 mt-auto">
              <ClayInput placeholder="Full Name" />
              <ClayInput placeholder="Prescription #" />
              <ClaySelect options={['Pick up at Store', 'Free Delivery']} />
              <ClayButton className="w-full py-3">Submit Refill</ClayButton>
            </div>
          </ClayCard>

          {/* Upload Card */}
          <ClayCard className="p-8 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300 border-blue-200/50">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 shadow-inner text-purple-600">
                <ShieldCheck />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-700">New Prescription</h3>
            <p className="mb-6 text-gray-500">Snap a photo of your new script. Our AI will help extract details for faster processing.</p>
            <div className="mt-auto">
                <PrescriptionUpload />
            </div>
          </ClayCard>

          {/* Transfer Card */}
          <ClayCard className="p-8 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300">
             <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-6 shadow-inner text-green-600">
                <Truck />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Transfer Profile</h3>
            <p className="mb-6 text-gray-500">Move your records to Medixly Pharmacy. We handle the communication for you.</p>
            <div className="space-y-4 mt-auto">
              <ClayInput placeholder="Current Pharmacy Name" />
              <ClayInput placeholder="Patient Name" />
              <ClayInput placeholder="Phone Number" type="tel" />
              <ClayButton className="w-full py-3">Start Transfer</ClayButton>
            </div>
          </ClayCard>

        </div>
      </section>

      {/* Info & Clinic Section */}
      <section id="clinic" className="bg-white/50 rounded-t-[60px] md:rounded-t-[100px] mt-12 pb-24 border-t border-white shadow-[0_-10px_40px_rgba(255,255,255,0.8)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-800">Complete Care Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <ClayCard className="p-6 text-center hover:scale-105 transition-transform cursor-default">
                    <Truck className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                    <h4 className="font-bold text-lg">Free Delivery</h4>
                </ClayCard>
                <ClayCard className="p-6 text-center hover:scale-105 transition-transform cursor-default">
                    <Recycle className="w-8 h-8 mx-auto mb-3 text-green-500" />
                    <h4 className="font-bold text-lg">Medication Disposal</h4>
                </ClayCard>
                <ClayCard className="p-6 text-center hover:scale-105 transition-transform cursor-default">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                    <h4 className="font-bold text-lg">Senior Discounts</h4>
                </ClayCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ClayCard className="p-10 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Minor Ailment Clinic</h3>
                    <p className="text-gray-500 text-lg mb-6">Skip the walk-in clinic wait. Pharmacist assessments available.</p>
                    <ul className="space-y-2 text-gray-600 mb-8">
                        <li className="flex items-center"><div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>UTIs & Pink Eye</li>
                        <li className="flex items-center"><div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>Skin Rashes & Insect Bites</li>
                        <li className="flex items-center"><div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>Allergic Rhinitis</li>
                    </ul>
                    <ClayButton className="w-full md:w-auto px-8">Book Assessment</ClayButton>
                </ClayCard>

                <ClayCard className="p-10 relative overflow-hidden group">
                     <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-teal-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Vaccine Clinic</h3>
                    <p className="text-gray-500 text-lg mb-6">Stay protected year-round. Walk-ins welcome during clinic hours.</p>
                     <ul className="space-y-2 text-gray-600 mb-8">
                        <li className="flex items-center"><div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>Flu Shots</li>
                        <li className="flex items-center"><div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>COVID-19 Boosters</li>
                        <li className="flex items-center"><div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>Travel Vaccines</li>
                    </ul>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-100 p-3 rounded-xl w-fit">
                        <Clock className="w-4 h-4" />
                        Weekdays 3pm - 6pm
                    </div>
                </ClayCard>
            </div>

            <div className="mt-24 text-center">
                <h3 className="text-3xl font-bold text-gray-700">About Medixly Pharmacy</h3>
                <p className="max-w-3xl mx-auto mt-8 text-xl italic text-gray-500 leading-relaxed">
                    "Located at 10 Denarius Cres, Richmond Hill, Toronto, Ontario, we are more than just a drug store. We are a soft pillar of support for the community, dedicated to accessible healthcare and personal pharmacist consultations."
                </p>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="p-4 md:p-12 bg-[#e8eff5]">
        <ClayCard className="max-w-7xl mx-auto p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#f0f4f8]">
            <div className="space-y-6">
                <h4 className="text-2xl font-bold text-blue-800">Connect With Us</h4>
                <div className="space-y-4 text-gray-600 font-medium">
                    <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-blue-500 shrink-0" />
                        <p>10 Denarius Cres, Richmond Hill, Toronto, ON</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <Clock className="w-6 h-6 text-blue-500 shrink-0" />
                        <p>Open All Week: 9 am - 6 pm</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-blue-500 shrink-0" />
                        <p>Tel: 416-731-3400 <span className="mx-2 text-gray-300">|</span> Fax: 416-731-3400</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-blue-500 shrink-0" />
                        <p>shenoudamesseha@gmail.com</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white/40 p-6 rounded-[30px] border border-white/50">
                <h5 className="font-bold text-lg mb-4 text-gray-700">Quick Message</h5>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <ClayInput placeholder="Your Email" type="email" />
                    <textarea 
                         className="bg-clay-bg rounded-[15px] shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] border-none p-4 w-full outline-none text-clay-text placeholder-gray-400 min-h-[100px] resize-none focus:ring-2 focus:ring-blue-100"
                         placeholder="How can we help?"
                    ></textarea>
                    <ClayButton className="w-full py-3">Send Message</ClayButton>
                </form>
            </div>
        </ClayCard>
        <div className="text-center mt-12 text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} Medixly Pharmacy. Designed with Care.
        </div>
      </footer>

      {/* AI Assistant */}
      <ChatAssistant />
      
    </div>
  );
};

export default App;
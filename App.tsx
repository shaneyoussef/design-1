import { useState } from 'react';
import { Printer } from 'lucide-react';
import { GraphiteCheckbox, GraphiteInput, Section } from './components/UI';

export default function App() {
  const [patientType, setPatientType] = useState<'new' | 'existing'>('new');
  
  // History State
  const [history, setHistory] = useState({
    allergy: { yes: false, nka: false },
    prescriptions: { yes: false, no: false },
    otc: { yes: false, no: false },
    pregnant: { yes: false, no: false },
    kidney: { yes: false, no: false },
  });

  // Info State
  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    healthCard: '',
    coverage: ''
  });

  // New Rx State
  const [newRx, setNewRx] = useState({
    indication: '',
    changeDescription: ''
  });

  // Refill State
  const [refill, setRefill] = useState({
    compliant: false,
    effective: false,
    concern: false,
    changes: false,
    sideEffects: false,
    notes: ''
  });

  // Review State
  const [review, setReview] = useState({
    dose: { correct: false, no: false },
    interactions: { yes: false, no: false },
    duration: { yes: false, no: false },
    drp: { yes: false, no: false },
    pharmacistName: ''
  });
  
  // Handlers for printing
  const handlePrint = () => {
    window.print();
  };

  // Helper for mutually exclusive toggles in History
  const toggleHistory = (category: keyof typeof history, field: string) => {
    setHistory(prev => {
        const cat = prev[category] as Record<string, boolean>;
        // If clicking the one that is already checked, uncheck it.
        // If clicking a new one, uncheck others in the group.
        const isCurrentlyChecked = cat[field];
        const newCat = Object.keys(cat).reduce((acc, key) => {
            acc[key] = key === field ? !isCurrentlyChecked : false;
            return acc;
        }, {} as Record<string, boolean>);
        return { ...prev, [category]: newCat };
    });
  };

  // Helper for mutually exclusive toggles in Review
  const toggleReview = (category: keyof Omit<typeof review, 'pharmacistName'>, field: string) => {
    setReview(prev => {
        const cat = prev[category] as Record<string, boolean>;
        const isCurrentlyChecked = cat[field];
        const newCat = Object.keys(cat).reduce((acc, key) => {
            acc[key] = key === field ? !isCurrentlyChecked : false;
            return acc;
        }, {} as Record<string, boolean>);
        return { ...prev, [category]: newCat };
    });
  };

  return (
    <div className="min-h-screen bg-paper-100 text-graphite-900 relative selection:bg-graphite-900 selection:text-paper-100">
      
      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Main Grid Layout */}
      <div className="max-w-[1200px] mx-auto border-l border-r border-graphite-900/10 min-h-screen bg-paper-100 shadow-2xl flex flex-col">
        
        {/* Header */}
        <header className="border-b border-graphite-900/10 p-8 flex justify-between items-end sticky top-0 bg-paper-100/95 backdrop-blur-sm z-40 print:static print:border-b-2 print:border-black">
          <div>
            <div className="font-mono text-xs text-graphite-400 uppercase tracking-widest mb-2">Form OP-0492 // Intake</div>
            <h1 className="font-sans text-3xl font-extrabold uppercase tracking-[0.2em] text-graphite-900">
              Old Park Pharmacy
            </h1>
          </div>
          
          <div className="flex items-center gap-6 no-print">
             <div className="flex bg-paper-200 p-1 rounded-sm border border-graphite-900/10">
                <button
                    onClick={() => setPatientType('new')}
                    className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 ${patientType === 'new' ? 'bg-graphite-900 text-white shadow-md' : 'text-graphite-400 hover:text-graphite-900'}`}
                >
                    New Patient
                </button>
                <button
                    onClick={() => setPatientType('existing')}
                    className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-300 ${patientType === 'existing' ? 'bg-graphite-900 text-white shadow-md' : 'text-graphite-400 hover:text-graphite-900'}`}
                >
                    Existing Patient
                </button>
             </div>

            <button 
              onClick={handlePrint}
              className="group flex items-center gap-3 bg-white border border-graphite-900/20 px-6 py-3 hover:bg-graphite-900 hover:text-white transition-all duration-300"
            >
              <span className="font-mono text-xs uppercase tracking-widest">Print Form</span>
              <Printer size={16} />
            </button>
          </div>
          
          {/* Print-only Header Status */}
          <div className="hidden print:block font-mono text-sm uppercase">
             Status: <span className="font-bold border border-black px-2 py-1">{patientType} Patient</span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-12 gap-8 print:block">
          
          {/* Left Column (History & Info) - Disabled if Existing */}
          <div className="md:col-span-6 space-y-8 print:w-1/2 print:float-left print:pr-4">
            
            {/* Patient Status Checkboxes (Visual Only for Print) */}
            <div className="hidden print:flex gap-12 mb-8 border-b border-black pb-4">
               <div className="flex items-center gap-2">
                 <div className={`w-4 h-4 border border-black ${patientType === 'new' ? 'bg-black' : ''}`}></div>
                 <span className="font-mono text-sm uppercase">New Patient</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className={`w-4 h-4 border border-black ${patientType === 'existing' ? 'bg-black' : ''}`}></div>
                 <span className="font-mono text-sm uppercase">Existing Patient</span>
               </div>
            </div>

            <Section 
                title="History" 
                disabled={patientType === 'existing'}
                className="h-fit"
            >
                <div className="grid grid-cols-[120px_1fr] gap-y-6 items-center">
                    <span className="font-mono text-sm uppercase">Allergy</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={history.allergy.yes} onChange={() => toggleHistory('allergy', 'yes')} disabled={patientType === 'existing'} />
                        <GraphiteCheckbox label="NKA" checked={history.allergy.nka} onChange={() => toggleHistory('allergy', 'nka')} disabled={patientType === 'existing'} />
                    </div>

                    <span className="font-mono text-sm uppercase">Prescriptions</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={history.prescriptions.yes} onChange={() => toggleHistory('prescriptions', 'yes')} disabled={patientType === 'existing'} />
                        <GraphiteCheckbox label="No" checked={history.prescriptions.no} onChange={() => toggleHistory('prescriptions', 'no')} disabled={patientType === 'existing'} />
                    </div>

                    <span className="font-mono text-sm uppercase">OTC / Herbal</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={history.otc.yes} onChange={() => toggleHistory('otc', 'yes')} disabled={patientType === 'existing'} />
                        <GraphiteCheckbox label="No" checked={history.otc.no} onChange={() => toggleHistory('otc', 'no')} disabled={patientType === 'existing'} />
                    </div>

                    <span className="font-mono text-sm uppercase">Pregnant / BF</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={history.pregnant.yes} onChange={() => toggleHistory('pregnant', 'yes')} disabled={patientType === 'existing'} />
                        <GraphiteCheckbox label="No" checked={history.pregnant.no} onChange={() => toggleHistory('pregnant', 'no')} disabled={patientType === 'existing'} />
                    </div>

                    <span className="font-mono text-sm uppercase">Kidney / Liver</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={history.kidney.yes} onChange={() => toggleHistory('kidney', 'yes')} disabled={patientType === 'existing'} />
                        <GraphiteCheckbox label="No" checked={history.kidney.no} onChange={() => toggleHistory('kidney', 'no')} disabled={patientType === 'existing'} />
                    </div>
                </div>
            </Section>

            <Section 
                title="Info" 
                disabled={patientType === 'existing'}
            >
                <div className="grid grid-cols-2 gap-6">
                    <GraphiteInput label="First Name" disabled={patientType === 'existing'} value={info.firstName} onChange={e => setInfo({...info, firstName: e.target.value})} />
                    <GraphiteInput label="Last Name" disabled={patientType === 'existing'} value={info.lastName} onChange={e => setInfo({...info, lastName: e.target.value})} />
                </div>
                <GraphiteInput label="Address" disabled={patientType === 'existing'} value={info.address} onChange={e => setInfo({...info, address: e.target.value})} />
                <div className="grid grid-cols-2 gap-6">
                    <GraphiteInput label="Postal Code" disabled={patientType === 'existing'} value={info.postalCode} onChange={e => setInfo({...info, postalCode: e.target.value})} />
                    <GraphiteInput label="Health Card #" disabled={patientType === 'existing'} value={info.healthCard} onChange={e => setInfo({...info, healthCard: e.target.value})} />
                </div>
                <GraphiteInput label="Additional Coverage" disabled={patientType === 'existing'} value={info.coverage} onChange={e => setInfo({...info, coverage: e.target.value})} />
            </Section>
          </div>

          {/* Right Column (Prescriptions & Pharmacist) - Always Enabled */}
          <div className="md:col-span-6 space-y-8 print:w-1/2 print:float-right print:pl-4">
            
            <Section title="New Prescription / Change">
                <GraphiteInput label="Indication" value={newRx.indication} onChange={e => setNewRx({...newRx, indication: e.target.value})} />
                <GraphiteInput label="Change Description" className="mt-4" value={newRx.changeDescription} onChange={e => setNewRx({...newRx, changeDescription: e.target.value})} />
            </Section>

            <Section title="Refill Prescription">
                 <div className="grid grid-cols-2 gap-y-4">
                    <GraphiteCheckbox label="Compliant" checked={refill.compliant} onChange={() => setRefill({...refill, compliant: !refill.compliant})} />
                    <GraphiteCheckbox label="Effective" checked={refill.effective} onChange={() => setRefill({...refill, effective: !refill.effective})} />
                    
                    <GraphiteCheckbox label="Concern" checked={refill.concern} onChange={() => setRefill({...refill, concern: !refill.concern})} />
                    <GraphiteCheckbox label="Changes" checked={refill.changes} onChange={() => setRefill({...refill, changes: !refill.changes})} />
                    
                    <GraphiteCheckbox label="Side Effects" checked={refill.sideEffects} onChange={() => setRefill({...refill, sideEffects: !refill.sideEffects})} />
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-graphite-900/10">
                    <GraphiteInput label="Detailed Notes" placeholder="Enter notes here..." value={refill.notes} onChange={e => setRefill({...refill, notes: e.target.value})} />
                 </div>
            </Section>

            <Section title="Pharmacist Review" className="bg-paper-200/30">
                <div className="grid grid-cols-[140px_1fr] gap-y-4 items-center">
                    <span className="font-mono text-sm uppercase font-bold">Dose</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Correct" checked={review.dose.correct} onChange={() => toggleReview('dose', 'correct')} />
                        <GraphiteCheckbox label="No" checked={review.dose.no} onChange={() => toggleReview('dose', 'no')} />
                    </div>

                    <span className="font-mono text-sm uppercase font-bold">Interactions</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={review.interactions.yes} onChange={() => toggleReview('interactions', 'yes')} />
                        <GraphiteCheckbox label="No" checked={review.interactions.no} onChange={() => toggleReview('interactions', 'no')} />
                    </div>

                    <span className="font-mono text-sm uppercase font-bold">Duration</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={review.duration.yes} onChange={() => toggleReview('duration', 'yes')} />
                        <GraphiteCheckbox label="No" checked={review.duration.no} onChange={() => toggleReview('duration', 'no')} />
                    </div>

                    <span className="font-mono text-sm uppercase font-bold">DRP</span>
                    <div className="flex gap-6">
                        <GraphiteCheckbox label="Yes" checked={review.drp.yes} onChange={() => toggleReview('drp', 'yes')} />
                        <GraphiteCheckbox label="No" checked={review.drp.no} onChange={() => toggleReview('drp', 'no')} />
                    </div>
                </div>

                <div className="mt-8 space-y-8">
                    <div className="border border-graphite-900/20 h-24 p-2">
                        <p className="font-mono text-[10px] text-graphite-400 uppercase tracking-wider mb-2">Clinical Notes</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 items-end pt-4">
                         <GraphiteInput label="Pharmacist Name" value={review.pharmacistName} onChange={e => setReview({...review, pharmacistName: e.target.value})} />
                         <div className="border-b border-graphite-900/20 h-10 flex items-end pb-1">
                            <span className="font-mono text-[10px] text-graphite-400 uppercase tracking-wider block w-full">Sign / Date</span>
                         </div>
                    </div>
                </div>
            </Section>

          </div>

          <div className="print:clear-both"></div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-graphite-900/10 p-8 flex justify-between items-center bg-paper-100 text-graphite-400">
           <div className="font-mono text-[10px] uppercase tracking-widest">
                Confidential Medical Record
           </div>
           <div className="font-mono text-[10px] uppercase tracking-widest">
                Page 01 / 01
           </div>
        </footer>

      </div>
    </div>
  );
}
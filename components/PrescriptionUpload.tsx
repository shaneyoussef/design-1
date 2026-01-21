import React, { useState, useRef } from 'react';
import { ClayCard, ClayButton, ClayInput } from './ClayComponents';
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzePrescriptionImage } from '../services/gemini';
import { PrescriptionAnalysis } from '../types';

export const PrescriptionUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PrescriptionAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImage(result);
      // Remove data URL prefix for Gemini API
      const base64 = result.split(',')[1];
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    setAnalysis(null);
    setError(null);
    try {
      const result = await analyzePrescriptionImage(base64);
      setAnalysis(result);
    } catch (err) {
      setError("Could not analyze image. Please fill details manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="h-48 border-2 border-dashed border-blue-200 rounded-[20px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-500 font-medium">Click to upload prescription</p>
          <p className="text-sm text-gray-400 mt-1">or take a photo</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative">
          <img src={image} alt="Prescription" className="w-full h-48 object-cover rounded-[20px]" />
          <button 
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
          >
            <AlertCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {analyzing && (
        <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-4 rounded-xl">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">AI Analyzing prescription...</span>
        </div>
      )}

      {analysis && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
            <CheckCircle className="w-5 h-5" />
            <span>Analysis Complete</span>
          </div>
          <div className="text-sm text-gray-600">
            <p><span className="font-semibold">Medication:</span> {analysis.medicationName || 'Not detected'}</p>
            <p><span className="font-semibold">Dosage:</span> {analysis.dosage || 'Not detected'}</p>
            <p><span className="font-semibold">Instructions:</span> {analysis.instructions || 'Not detected'}</p>
          </div>
        </div>
      )}

      <ClayInput 
        placeholder="Full Name" 
        defaultValue={analysis ? "John Doe (Auto-filled)" : ""}
      />
       {/* Pre-fill logic would ideally go here with real state binding, kept simple for demo */}
      <ClayButton className="w-full py-4 text-lg">
        Send Prescription
      </ClayButton>
    </div>
  );
};

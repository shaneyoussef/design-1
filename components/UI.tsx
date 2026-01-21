import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export const GraphiteCheckbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled, className = '' }) => {
    return (
        <label className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}>
            <div 
                className={`w-5 h-5 border transition-all duration-300 flex items-center justify-center
                    ${checked ? 'bg-graphite-900 border-graphite-900' : 'border-graphite-900/30 group-hover:border-graphite-900'}
                `}
                onClick={(e) => {
                    if (disabled) return;
                    e.preventDefault();
                    onChange(!checked);
                }}
            >
                {checked && <Check size={14} className="text-paper-100" strokeWidth={3} />}
            </div>
            <span className="font-mono text-sm text-graphite-900 uppercase tracking-wide">{label}</span>
        </label>
    );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const GraphiteInput: React.FC<InputProps> = ({ label, className, disabled, ...props }) => {
    return (
        <div className={`flex flex-col gap-1 w-full ${disabled ? 'opacity-50' : ''} ${className}`}>
            <label className="font-mono text-[10px] text-graphite-400 uppercase tracking-wider">{label}</label>
            <input 
                disabled={disabled}
                className={`
                    w-full bg-transparent border-b border-graphite-900/20 py-1 
                    font-sans text-lg text-graphite-900 placeholder-graphite-400/30
                    focus:outline-none focus:border-graphite-900 transition-colors
                    disabled:cursor-not-allowed
                `}
                {...props}
            />
        </div>
    );
};

export const SectionHeader: React.FC<{ title: string; disabled?: boolean }> = ({ title, disabled }) => (
    <div className={`flex items-center gap-4 mb-6 ${disabled ? 'opacity-50' : ''}`}>
        <div className={`w-3 h-3 bg-graphite-900 ${disabled ? 'bg-graphite-400' : ''}`} />
        <h2 className="font-sans text-xl font-light uppercase tracking-widest">{title}</h2>
    </div>
);

export const Section: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    disabled?: boolean; 
    className?: string 
}> = ({ title, children, disabled = false, className = '' }) => {
    return (
        <div className={`relative p-8 border border-graphite-900/10 transition-all duration-500 print-break-inside ${className} ${disabled ? 'bg-paper-200/50 grayscale' : 'bg-white'}`}>
            <SectionHeader title={title} disabled={disabled} />
            <div className={`space-y-6 ${disabled ? 'pointer-events-none select-none opacity-40' : ''}`}>
                {children}
            </div>
            {disabled && (
                <div className="absolute top-4 right-4 font-mono text-[10px] border border-graphite-900 px-2 py-1 uppercase tracking-widest">
                    Not Required
                </div>
            )}
        </div>
    );
};
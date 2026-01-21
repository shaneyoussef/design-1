import React from 'react';

interface ClayProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const ClayCard: React.FC<ClayProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-clay-bg rounded-[35px] shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff] border-4 border-transparent transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const ClayButton: React.FC<ClayButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyles = "rounded-[20px] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] font-bold transition-transform active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] active:scale-95 flex items-center justify-center";
  
  let colors = "bg-clay-bg text-clay-accent";
  if (variant === 'secondary') colors = "bg-clay-bg text-gray-500";
  if (variant === 'danger') colors = "bg-clay-bg text-red-500";

  return (
    <button 
      className={`${baseStyles} ${colors} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const ClayInput: React.FC<ClayInputProps> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`bg-clay-bg rounded-[15px] shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] border-none p-4 w-full outline-none text-clay-text placeholder-gray-400 focus:ring-2 focus:ring-blue-100 transition-all ${className}`}
      {...props}
    />
  );
};

interface ClaySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

export const ClaySelect: React.FC<ClaySelectProps> = ({ options, className = '', ...props }) => {
    return (
        <div className="relative">
            <select 
                 className={`appearance-none bg-clay-bg rounded-[15px] shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] border-none p-4 w-full outline-none text-clay-text cursor-pointer ${className}`}
                 {...props}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    )
}

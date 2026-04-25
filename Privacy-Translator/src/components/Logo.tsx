import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background shape */}
      <div className="absolute inset-0 bg-brand-gradient rounded-xl rotate-6 opacity-20" />
      <div className="absolute inset-0 bg-brand-gradient rounded-xl -rotate-3 opacity-10" />
      
      {/* Chat bubble split */}
      <div className="relative w-full h-full bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-indigo-600" />
        <div className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-1/2 h-1/2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center items-center gap-1">
          <div className="w-1/2 h-0.5 bg-slate-900 rounded-full opacity-30" />
          <div className="w-1/3 h-0.5 bg-slate-900 rounded-full opacity-30" />
          <div className="w-1/2 h-0.5 bg-slate-900 rounded-full opacity-30" />
        </div>
      </div>
    </div>
  );
};

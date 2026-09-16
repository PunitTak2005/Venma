import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VendorCTAButton({ to, label = 'Visit Store', className = '' }) {
  return (
    <Link
      to={to}
      className={`group/btn w-full h-12 min-h-[44px] px-4 rounded-2xl bg-slate-100 hover:bg-[#C87D55] dark:bg-[#25252A] dark:hover:bg-[#C87D55] text-slate-800 hover:text-white dark:text-slate-100 dark:hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-220 ease-out shadow-xs hover:shadow-md active:scale-[0.99] flex-shrink-0 ${className}`}
    >
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 transform transition-transform duration-220 ease-out group-hover/btn:translate-x-1.5 flex-shrink-0" />
    </Link>
  );
}

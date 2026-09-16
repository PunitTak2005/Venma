import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function VerifiedBadge({ label = 'Verified Store' }) {
  return (
    <div className="inline-flex items-center h-6 px-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] font-bold tracking-wide shadow-2xs flex-shrink-0 select-none">
      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500 animate-pulse flex-shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

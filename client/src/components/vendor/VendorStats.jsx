import React from 'react';
import { Star } from 'lucide-react';

export default function VendorStats({ rating = 4.9, productsCount = '240+', satisfaction = '98%' }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-200/70 dark:divide-slate-800 py-3 px-2 rounded-2xl bg-slate-50 dark:bg-[#161619] border border-slate-200/60 dark:border-[#2C2C32] text-center shadow-xs">
      {/* 1. Rating Column */}
      <div className="flex flex-col items-center justify-center px-1">
        <div className="flex items-center justify-center gap-1 text-slate-900 dark:text-white">
          <Star className="w-3.5 h-3.5 fill-[#D4A24C] text-[#D4A24C] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-black tracking-tight">{Number(rating).toFixed(1)}</span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap">
          Rating
        </span>
      </div>

      {/* 2. Products Column */}
      <div className="flex flex-col items-center justify-center px-1">
        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono tracking-tight whitespace-nowrap">
          {productsCount}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap">
          Products
        </span>
      </div>

      {/* 3. Satisfaction Column */}
      <div className="flex flex-col items-center justify-center px-1">
        <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight whitespace-nowrap">
          {satisfaction}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap">
          Positive
        </span>
      </div>
    </div>
  );
}

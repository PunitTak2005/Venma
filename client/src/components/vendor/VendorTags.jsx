import React from 'react';

export default function VendorTags({ tags = [] }) {
  const displayTags = tags.length > 0 ? tags.slice(0, 3) : ['Verified Seller', 'Official Store'];

  return (
    <div className="flex flex-wrap items-center gap-2 min-h-[32px]">
      {displayTags.map((tag, idx) => (
        <span
          key={idx}
          className="inline-flex items-center h-7 px-2.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#28282E] border border-slate-200/60 dark:border-[#36363E] rounded-lg whitespace-nowrap shadow-2xs transition-colors"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

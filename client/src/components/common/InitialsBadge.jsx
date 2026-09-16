import React from 'react';

/**
 * Dynamically generates vendor initials from store name.
 * Handles single-word PascalCase (UrbanStride -> US),
 * compound brand names with category descriptors (FitMotion Sports -> FM, TechNova Electronics -> TN),
 * and multi-word stores (AutoShine Garage -> AG, BrewCraft Coffee -> BC, GlowLeaf Skincare -> GS).
 */
export function getVendorInitials(name) {
  if (!name || typeof name !== 'string') return 'VN';
  const clean = name.trim();
  if (!clean) return 'VN';

  const categorySuffixes = ['Electronics', 'Sports'];
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length >= 2 && categorySuffixes.includes(words[1])) {
    const firstWordUppers = words[0].match(/[A-Z]/g);
    if (firstWordUppers && firstWordUppers.length >= 2) {
      return (firstWordUppers[0] + firstWordUppers[1]).toUpperCase();
    }
  }

  if (words.length === 1) {
    const uppers = words[0].match(/[A-Z]/g);
    if (uppers && uppers.length >= 2) {
      return (uppers[0] + uppers[1]).toUpperCase();
    }
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function InitialsBadge({ name = '', className = '', title }) {
  const initials = getVendorInitials(name);
  const vendorName = name || 'Vendor';

  return (
    <div
      role="img"
      aria-label={`${vendorName} initials`}
      title={title || vendorName}
      className={`w-7 h-7 sm:w-[30px] sm:h-[30px] md:w-8 md:h-8 shrink-0 rounded-full border border-[#C67C4E]/20 dark:border-[#C67C4E]/30 bg-[#C67C4E]/10 dark:bg-[#C67C4E]/15 text-[#C67C4E] dark:text-[#E09B6F] flex items-center justify-center text-[11.5px] sm:text-[12px] md:text-[13px] font-bold tracking-tight select-none transition-all duration-200 ${className}`}
    >
      {initials}
    </div>
  );
}

import React, { useState } from 'react';

export default function VendorBanner({ banner, storeName }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-[28px] bg-slate-200 dark:bg-slate-800 select-none">
      {/* Skeleton shimmer before load */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse" />
      )}

      {/* Banner image with smooth 1.03x hover zoom */}
      <img
        src={banner || '/generated-vendors/technova-electronics-banner.webp'}
        alt={`${storeName} showcase banner`}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-220 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />

      {/* Uniform soft ambient gradient overlay for depth & contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
    </div>
  );
}

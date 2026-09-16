import React from 'react';

export default function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 animate-pulse max-w-7xl">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2 w-64 h-4 bg-slate-200 dark:bg-slate-800 rounded" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 aspect-square rounded-[24px] bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Info Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Merchant Pill */}
          <div className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          {/* Title & Brand */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-8 w-3/5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center space-x-3">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>

          {/* Price Box */}
          <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />

          {/* Quantity & Actions */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-12 flex-1 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Trust Grid */}
          <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Accordions Skeleton */}
      <div className="space-y-4 pt-6 max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

import React from 'react';

export default function VendorCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1E1E22] rounded-[28px] border border-slate-200/80 dark:border-[#2C2C32] overflow-hidden shadow-xs flex flex-col justify-between h-full min-h-[500px] animate-pulse">
      {/* 1. Banner Skeleton (16:9) */}
      <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800" />

      {/* 2. Floating Logo & 3. Badge Skeleton */}
      <div className="px-6 flex items-end justify-between flex-shrink-0">
        <div className="relative -mt-9 w-[72px] h-[72px] rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-[#1E1E22]" />
        <div className="mb-2 h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Main Content Area */}
      <div className="px-6 pt-3 pb-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* 4. Title Skeleton */}
          <div className="min-h-[50px] flex flex-col justify-center space-y-1.5">
            <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-3/5 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>

          {/* 5. Tag Skeleton */}
          <div className="flex gap-2 min-h-[32px] items-center">
            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>

          {/* 6. Description Skeleton */}
          <div className="min-h-[58px] space-y-1.5 pt-1">
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>

        {/* Bottom Container */}
        <div className="space-y-4 pt-1">
          {/* 7. Stats Skeleton */}
          <div className="h-16 w-full bg-slate-100 dark:bg-[#161619] rounded-2xl border border-slate-200/60 dark:border-[#2C2C32]" />

          {/* 8. Button Skeleton */}
          <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

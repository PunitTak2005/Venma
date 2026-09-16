import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Store, Check, AlertCircle } from 'lucide-react';
import VendorCard from './VendorCard';
import VendorCardSkeleton from './VendorCardSkeleton';

export default function VendorShowcaseSection({ vendors = [], totalVendors = 10, loading = false }) {
  const featuredVendors = vendors.slice(0, 4);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  }, []);

  return (
    <section className="container mx-auto px-4" aria-labelledby="top-rated-merchants-heading">
      <div className="rounded-[36px] bg-[#F7F5F2] dark:bg-[#141416] p-6 sm:p-10 border border-[#DDD6CE]/80 dark:border-[#28282D] shadow-[0_12px_36px_rgba(28,28,30,0.04)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.3)] space-y-8">
        {/* 1. Hero Introduction Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-center sm:text-left pb-4 border-b border-[#DDD6CE]/40 dark:border-slate-800/80">
          <div className="space-y-2 max-w-2xl">
            {/* Small Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C87D55]/10 dark:bg-[#C87D55]/20 text-[#C87D55] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Verified Merchants</span>
            </div>

            {/* Large Heading */}
            <h2
              id="top-rated-merchants-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1C1E] dark:text-[#F8F7F5] tracking-tight leading-tight"
            >
              Top Rated Merchant Stores
            </h2>

            {/* Supporting Text */}
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Handpicked independent sellers with 98%+ positive buyer ratings, premium craftsmanship, and trusted customer service.
            </p>
          </div>

          {/* CTA Button */}
          <Link
            to="/vendors"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] dark:bg-[#202024] dark:hover:bg-[#2C2C32] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-220 ease-out self-center sm:self-end flex-shrink-0 group"
          >
            <Store className="w-4 h-4 text-[#C87D55] flex-shrink-0" />
            <span>Explore All {totalVendors} Vendors</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-220 flex-shrink-0" />
          </Link>
        </div>

        {/* 2. Responsive 2x2 Vendor Grid (Desktop & Tablet: 2x2, Mobile: 1-Column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
          {loading || featuredVendors.length === 0
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-full flex flex-col">
                  <VendorCardSkeleton />
                </div>
              ))
            : featuredVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  className="w-full h-full flex flex-col"
                >
                  <VendorCard vendor={vendor} onToast={showToast} />
                </div>
              ))}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-red-950/95 text-red-200 border-red-800/80 shadow-red-950/40'
              : 'bg-[#1C1C1E]/95 text-white border-slate-700/80 shadow-black/40'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}
    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Store, CheckCircle, ArrowRight, ShieldCheck, Clock, Award, MapPin } from 'lucide-react';
import InitialsBadge from '../common/InitialsBadge';

export default function VendorSpotlight({ vendor }) {
  const vendorSlug = vendor?.storeSlug || vendor?._id || '';
  const storeName = vendor?.storeName || 'Official Merchant';
  const location = vendor?.location || (vendor?.address?.city ? `${vendor.address.city}, ${vendor.address.state}` : '');

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1A1A1D] border border-[#DDD6CE] dark:border-[#2C2C30] p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Vendor Info */}
        <div className="flex items-center space-x-3">
          <InitialsBadge name={storeName} />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-bold text-[#1C1C1E] dark:text-[#F8F7F5]">
                {storeName}
              </h4>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Merchant
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center flex-wrap gap-1.5">
              {location && (
                <span className="inline-flex items-center text-slate-600 dark:text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C87D55] mr-1 flex-shrink-0" />
                  <span>{location}</span>
                  <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                </span>
              )}
              <span>Authorized Marketplace Brand Partner</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {vendorSlug && (
          <Link
            to={`/vendors/${vendorSlug}`}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#F8ECE3] dark:bg-[#252528] text-[#C87D55] dark:text-[#E09875] hover:bg-[#C87D55] hover:text-white dark:hover:bg-[#C87D55] dark:hover:text-white transition-all text-xs font-bold self-start sm:self-auto shadow-sm"
          >
            <span>Visit Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Merchant Trust Metrics */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#202024]">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Response Time</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-[#C87D55]" />
            &lt; 2 Hours
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#202024]">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Order Fulfillment</span>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" />
            99.6% On Time
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#202024]">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Quality Score</span>
          <span className="text-xs font-extrabold text-[#D4A24C] flex items-center justify-center gap-1 mt-0.5">
            <Award className="w-3 h-3" />
            4.9 / 5.0
          </span>
        </div>
      </div>
    </div>
  );
}

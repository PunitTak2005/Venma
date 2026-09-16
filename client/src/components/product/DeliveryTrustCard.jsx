import React, { useState, useEffect } from 'react';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function DeliveryTrustCard() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 25, seconds: 40 });

  // Calculate live dispatch countdown (cutoff time 5:00 PM local)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0); // 5:00 PM today

      if (now > cutoff) {
        cutoff.setDate(cutoff.getDate() + 1); // 5:00 PM tomorrow
      }

      const diff = cutoff - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl bg-[#F8ECE3]/60 dark:bg-[#202024] border border-[#DDD6CE] dark:border-[#333338] p-4 sm:p-5 space-y-4">
      {/* 1. Dispatch Countdown Alert */}
      <div className="flex items-start sm:items-center space-x-3 text-xs text-slate-800 dark:text-slate-200">
        <div className="p-2 rounded-xl bg-[#C87D55]/15 text-[#C87D55] flex-shrink-0">
          <Clock className="w-4 h-4 animate-pulse" />
        </div>
        <div className="leading-snug">
          <span className="font-bold text-[#1C1C1E] dark:text-white">Same-Day Dispatch Guarantee: </span>
          <span>
            Order within{' '}
            <strong className="text-[#C87D55] font-mono font-bold">
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </strong>{' '}
            to ship today.
          </span>
        </div>
      </div>

      {/* 2. Trust Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#DDD6CE]/60 dark:border-[#333338]">
        {/* Fast Shipping */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/70 dark:bg-[#1A1A1D]/80 border border-slate-200/60 dark:border-slate-800">
          <Truck className="w-4 h-4 text-[#C87D55] mb-1.5" />
          <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
            2–4 Day Delivery
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Tracked Express
          </span>
        </div>

        {/* Returns */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/70 dark:bg-[#1A1A1D]/80 border border-slate-200/60 dark:border-slate-800">
          <RotateCcw className="w-4 h-4 text-[#C87D55] mb-1.5" />
          <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
            30-Day Returns
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Hassle-Free Policy
          </span>
        </div>

        {/* Security */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/70 dark:bg-[#1A1A1D]/80 border border-slate-200/60 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1.5" />
          <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
            Secure Payments
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            256-Bit SSL Safe
          </span>
        </div>

        {/* Warranty */}
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/70 dark:bg-[#1A1A1D]/80 border border-slate-200/60 dark:border-slate-800">
          <Award className="w-4 h-4 text-[#D4A24C] mb-1.5" />
          <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
            2-Year Warranty
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Official Protection
          </span>
        </div>
      </div>
    </div>
  );
}

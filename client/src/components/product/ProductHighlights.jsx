import React from 'react';
import { Sparkles, ShieldCheck, Cpu, HeartHandshake } from 'lucide-react';

export default function ProductHighlights({ product }) {
  const highlights = [
    {
      icon: Sparkles,
      title: 'Precision Craftsmanship',
      desc: 'Engineered with premium, durable materials designed to exceed commercial-grade standards.',
    },
    {
      icon: Cpu,
      title: 'Intuitive & Ergonomic',
      desc: 'Thoughtfully designed for seamless everyday use, enhanced comfort, and effortless usability.',
    },
    {
      icon: ShieldCheck,
      title: 'Certified Quality',
      desc: 'Every unit passes rigorous multi-point testing for safety, stability, and lasting performance.',
    },
    {
      icon: HeartHandshake,
      title: 'Merchant Backed',
      desc: 'Backed by official warranty, direct manufacturer support, and transparent return protection.',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base sm:text-lg font-black text-[#1C1C1E] dark:text-[#F8F7F5] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#C87D55]" />
        <span>Product Highlights & Quality Standards</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1D] border border-[#DDD6CE] dark:border-[#2C2C30] hover:border-[#C87D55]/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#F8ECE3] dark:bg-[#2A2A2E] text-[#C87D55] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

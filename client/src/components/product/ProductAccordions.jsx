import React, { useState } from 'react';
import {
  ChevronDown,
  FileText,
  Sliders,
  Layers,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export default function ProductAccordions({ product }) {
  // Allow multiple or single open accordions; default open Description (0) and Specs (1)
  const [openSections, setOpenSections] = useState({ 0: true, 1: true });

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sections = [
    {
      id: 'description',
      title: 'Detailed Overview & Features',
      icon: FileText,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>{product.description}</p>
          <p className="text-slate-500 dark:text-slate-400">
            Crafted to harmonize aesthetics with utilitarian durability. Each item undergoes strict quality inspection prior to dispatch to ensure you receive a pristine product.
          </p>
        </div>
      ),
    },
    {
      id: 'specifications',
      title: 'Technical Specifications',
      icon: Sliders,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Brand</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {product.brand || 'VENMA Official'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Category</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {product.category?.name || 'Curated Goods'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 font-medium">SKU / Model</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              {product.sku || 'VN-PROD-99'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Availability</span>
            <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
            </span>
          </div>

          {/* Dynamic Specifications */}
          {(() => {
            const filteredSpecs = (product.specifications || []).filter(
              (spec) => spec?.key && !/^(finish\s*\/?\s*color|finish|color)$/i.test(spec.key.trim())
            );

            if (filteredSpecs.length > 0) {
              return filteredSpecs.map((spec, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">{spec.key}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{spec.value}</span>
                </div>
              ));
            }

            return (
              <>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Warranty</span>
                  <span className="font-semibold text-slate-900 dark:text-white">2-Year Official Merchant</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Item Condition</span>
                  <span className="font-semibold text-slate-900 dark:text-white">100% Brand New In Box</span>
                </div>
              </>
            );
          })()}
        </div>
      ),
    },
    {
      id: 'materials',
      title: 'Materials, Build & Care',
      icon: Layers,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Constructed with premium, environmentally conscious components. All finishes and structural elements are tested against everyday wear, friction, and environmental variations.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400 text-xs">
            <li>Clean with a soft microfiber cloth; avoid harsh solvents or abrasive cleaning pads.</li>
            <li>Store in a dry, temperate environment away from direct prolonged exposure to extreme heat.</li>
            <li>Follow the provided instruction manual for any required assembly or modular maintenance.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery Logistics',
      icon: Truck,
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>Standard Shipping:</strong> Estimated delivery within 2 to 4 business days. Real-time GPS and milestone tracking details are dispatched via email and SMS as soon as the carrier collects your package.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            All shipments are insured against transit loss or damage. Fragile and high-value orders are packed in reinforced, double-walled eco-packaging.
          </p>
        </div>
      ),
    },
    {
      id: 'returns',
      title: '30-Day Hassle-Free Returns & Warranty',
      icon: ShieldCheck,
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Not completely satisfied? We offer an effortless <strong>30-day return or exchange window</strong> from the date of delivery. Items must be returned in their original packaging and condition.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Every purchase includes VENMA Buyer Protection and a 2-year warranty against manufacturing defects. Initiating a return is simple via your customer dashboard.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        const isOpen = !!openSections[idx];
        const IconComponent = section.icon;

        return (
          <div
            key={section.id}
            className="rounded-2xl border border-[#DDD6CE] dark:border-[#2C2C30] bg-white dark:bg-[#1A1A1D] overflow-hidden transition-all duration-200 shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggleSection(idx)}
              className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left hover:bg-slate-50/70 dark:hover:bg-[#202024] transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-[#F8ECE3] dark:bg-[#252528] text-[#C87D55] flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-[#1C1C1E] dark:text-[#F8F7F5]">
                  {section.title}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? 'transform rotate-180 text-[#C87D55]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800">
                {section.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

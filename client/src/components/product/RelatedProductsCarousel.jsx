import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../customer/ProductCard';

export default function RelatedProductsCarousel({
  title = 'Related Products',
  subtitle = 'Curated items frequently purchased together with this product',
  products = [],
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C87D55]" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { ShoppingBag, Zap } from 'lucide-react';

export default function StickyMobileBar({
  product,
  quantity,
  onAddToCart,
  onBuyNow,
}) {
  if (!product) return null;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const primaryImage =
    product.thumbnail ||
    product.images?.[0] ||
    '/generated-products/electronics/wireless-headphones-main.webp';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white/95 dark:bg-[#141416]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#2C2C30] flex items-center justify-between gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      {/* Product Thumbnail & Price */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] text-slate-400 block truncate">
            {product.name}
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-black text-[#1C1C1E] dark:text-[#F8F7F5]">
              ₹{Number(effectivePrice * quantity).toLocaleString('en-IN')}
            </span>
            {quantity > 1 && (
              <span className="text-[10px] text-slate-400">
                (qty {quantity})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className="px-3.5 py-2.5 rounded-xl bg-[#C87D55] text-white font-bold text-xs shadow-md shadow-[#C87D55]/20 flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={product.stock === 0}
          className="px-4 py-2.5 rounded-xl bg-[#1C1C1E] dark:bg-white text-white dark:text-[#1C1C1E] font-bold text-xs shadow-md active:scale-95 disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

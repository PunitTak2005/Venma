import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/customer/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">My Wishlist</h1>
        <p className="text-xs text-slate-500 mt-1">
          Saved products you love across our verified vendors.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-slate-200 dark:border-slate-700 shadow-sm max-w-md mx-auto">
          <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow-md transition"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#C67C4E]" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

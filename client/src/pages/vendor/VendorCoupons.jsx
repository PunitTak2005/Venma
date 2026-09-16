import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function VendorCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('15');
  const [minPurchase, setMinPurchase] = useState('40');
  const [success, setSuccess] = useState('');

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons/vendor');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', {
        code,
        discountType,
        discountValue: Number(discountValue),
        minPurchase: Number(minPurchase),
      });
      if (res.data.success) {
        setSuccess('New coupon successfully created!');
        setCode('');
        fetchCoupons();
      }
    } catch (err) {
      alert('Failed to create coupon');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Store Promotional Coupons</h1>
        <p className="text-xs text-slate-400 mt-1">
          Create marketing discounts to attract repeat shoppers to your store.
        </p>
      </div>

      {success && (
        <div className="p-3 rounded-2xl bg-emerald-50 text-xs text-[#10B981] font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Create Coupon Card */}
      <form onSubmit={handleCreateCoupon} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create New Coupon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-slate-400 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. VIP25"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 uppercase font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Cash (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Discount Value</label>
            <input
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Min Cart Spend (₹)</label>
            <input
              type="number"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition"
        >
          Create Coupon
        </button>
      </form>

      {/* Coupons List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Coupons</h3>
        <div className="space-y-2 text-xs">
          {coupons.map((c) => (
            <div key={c._id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-sm text-[#C67C4E]">{c.code}</span>
                <p className="text-slate-400 text-[11px]">
                  {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`} • Min ₹${c.minPurchase} spend
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {c.isActive ? 'Active' : 'Expired'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

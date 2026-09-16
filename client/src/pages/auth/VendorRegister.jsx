import Logo from "../../components/common/Logo";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, Phone, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function VendorRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    storeName: '',
    storeDescription: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ ...formData, role: 'vendor' });
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Vendor onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <div className="bg-white dark:bg-slate-800 rounded-[20px] p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <Logo size="lg" linkTo="/" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-2">Register Your Merchant Store</h1>
          <p className="text-xs text-slate-400">Join 10+ premier vendors selling directly on VENMA</p>
        </div>

        {error && (
          <div className="p-3 rounded-[14px] bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 mb-1">Owner Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Marcus Vance"
                required
                className="w-full px-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Business Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="merchant@brand.com"
                required
                className="w-full px-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Official Store Name</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              placeholder="e.g. Kinetic Sound Labs"
              required
              className="w-full px-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Store Description</label>
            <textarea
              rows="2"
              value={formData.storeDescription}
              onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
              placeholder="Brief summary of your product specialty and quality pledge..."
              required
              className="w-full px-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (800) 555-0199"
                required
                className="w-full px-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Account Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[16px] bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow-md shadow-black/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Launch Vendor Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-[#DDD6CE] dark:border-[#3A3A40]">
          Already a merchant partner?{' '}
          <Link to="/login" className="font-bold text-[#C67C4E] hover:underline">
            Log in to vendor portal
          </Link>
        </div>
      </div>
    </div>
  );
}

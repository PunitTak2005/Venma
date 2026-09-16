import React, { useState } from 'react';
import { User, Store, Shield, Mail, Phone, MapPin, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });

      if (res.data.success) {
        updateUser(res.data.data);
        setSuccessMsg('Profile information updated successfully!');
      }
    } catch (err) {
      console.error('Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, primary shipping address, and security preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        {/* User Badge Info */}
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-[#F8ECE3] dark:bg-[#C67C4E]/20 text-[#C67C4E] flex items-center justify-center">
            {user?.role === 'admin' ? <Shield className="w-8 h-8" /> : user?.role === 'vendor' ? <Store className="w-8 h-8" /> : <User className="w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#F8ECE3] dark:bg-[#C67C4E]/20 text-[#C67C4E] uppercase">
              Role: {user?.role}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-[#10B981] flex items-center space-x-2 font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-3">
            Primary Delivery Address
          </h4>

          <div>
            <label className="block text-slate-500 mb-1">Street Address</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">State / Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">ZIP Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

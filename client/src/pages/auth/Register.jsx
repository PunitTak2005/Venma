import Logo from "../../components/common/Logo";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ ...formData, role: 'customer' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-[20px] p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <Logo size="lg" linkTo="/" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-2">Create Customer Account</h1>
          <p className="text-xs text-slate-400">Join VENMA to enjoy fast shipping & exclusive promotions</p>
        </div>

        {error && (
          <div className="p-3 rounded-[14px] bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Mercer"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@domain.com"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 019-2834"
                className="w-full pl-9 pr-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[16px] bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow-md shadow-black/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-[#DDD6CE] dark:border-[#3A3A40]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#C67C4E] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

import Logo from "../../components/common/Logo";
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, ShieldAlert, Store, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = location.state?.from || new URLSearchParams(location.search).get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo 1-Click login helper
  const handleQuickLogin = async (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
    setError('');
    setLoading(true);

    try {
      const user = await login(roleEmail, 'password123');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed');
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-2">Welcome to VENMA</h1>
          <p className="text-xs text-slate-400">Sign in to manage your orders, store, or platform</p>
        </div>

        {/* Demo Fast-Switcher Badges */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block">
            Instant 1-Click Role Login
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@venma.com')}
              className="py-1.5 px-2 rounded-[14px] bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] font-bold text-[11px] border border-[#DDD6CE] dark:border-[#3A3A40] hover:bg-[#EED7C7] transition flex items-center justify-center space-x-1"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('vendor@venma.com')}
              className="py-1.5 px-2 rounded-[14px] bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] font-bold text-[11px] border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 transition flex items-center justify-center space-x-1"
            >
              <Store className="w-3 h-3" />
              <span>Vendor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('buyer@venma.com')}
              className="py-1.5 px-2 rounded-[14px] bg-orange-50 dark:bg-orange-950/60 text-[#F97316] font-bold text-[11px] border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100 transition flex items-center justify-center space-x-1"
            >
              <User className="w-3 h-3" />
              <span>Buyer</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-[14px] bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-[16px] bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] text-[#1C1C1E] dark:text-[#F8F7F5] focus:outline-none focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[16px] bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow-md shadow-black/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In to Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 space-y-2 pt-2 border-t border-[#DDD6CE] dark:border-[#3A3A40]">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#C67C4E] hover:underline">
              Create customer account
            </Link>
          </p>
          <p>
            Want to sell products?{' '}
            <Link to="/vendor/register" className="font-bold text-[#C67C4E] hover:underline">
              Register as vendor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

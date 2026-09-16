import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Store, User, Lock, Mail, ArrowRight, Copy, Check, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from "../../components/common/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = location.state?.from || new URLSearchParams(location.search).get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoggingRole, setQuickLoggingRole] = useState(null);
  const [copied, setCopied] = useState(false);

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
    setQuickLoggingRole(roleEmail);

    try {
      const user = await login(roleEmail, 'password123');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Quick login failed');
    } finally {
      setLoading(false);
      setQuickLoggingRole(null);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText('password123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="flex justify-center">
            <Logo size="lg" linkTo="/" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-2">Welcome to VENMA</h1>
          <p className="text-xs text-slate-400">Sign in to manage your orders, store, or platform</p>
        </div>

        {/* Premium Platform Demonstration Credentials Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1E1E22] border border-[#E7DFD5] dark:border-[#3A3A40] shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-[#E7DFD5]/60 dark:border-[#333338]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[11px] sm:text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Platform Demonstration Credentials
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C67C4E]/10 text-[#C67C4E] border border-[#C67C4E]/20">
              Live Demo
            </span>
          </div>

          <div className="grid gap-2">
            {/* Administrator */}
            <div
              onClick={() => handleQuickLogin('admin@venma.com')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickLogin('admin@venma.com')}
              className="group p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#26262B] border border-[#E5DFD7] dark:border-[#35353B] hover:border-[#C67C4E]/60 dark:hover:border-[#C67C4E]/60 hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F8ECE3] dark:bg-[#342721] text-[#C67C4E] dark:text-[#E29D73] flex items-center justify-center transition-transform group-hover:scale-105">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Administrator
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    admin@venma.com
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#F8ECE3] dark:bg-[#342721] text-[#C67C4E] dark:text-[#E29D73] text-[11px] font-bold border border-[#DDD6CE] dark:border-[#44332A] group-hover:bg-[#C67C4E] group-hover:text-white transition-colors flex items-center gap-1">
                {quickLoggingRole === 'admin@venma.com' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <span>Admin</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </div>

            {/* Vendor */}
            <div
              onClick={() => handleQuickLogin('vendor@venma.com')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickLogin('vendor@venma.com')}
              className="group p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#26262B] border border-[#E5DFD7] dark:border-[#35353B] hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Vendor
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    vendor@venma.com
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] text-[11px] font-bold border border-emerald-200 dark:border-emerald-900/60 group-hover:bg-[#10B981] group-hover:text-white transition-colors flex items-center gap-1">
                {quickLoggingRole === 'vendor@venma.com' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <span>Vendor</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </div>

            {/* Buyer */}
            <div
              onClick={() => handleQuickLogin('buyer@venma.com')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickLogin('buyer@venma.com')}
              className="group p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#26262B] border border-[#E5DFD7] dark:border-[#35353B] hover:border-orange-500/60 dark:hover:border-orange-500/60 hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#F97316] flex items-center justify-center transition-transform group-hover:scale-105">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Buyer
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    buyer@venma.com
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[#F97316] text-[11px] font-bold border border-orange-200 dark:border-orange-900/60 group-hover:bg-[#F97316] group-hover:text-white transition-colors flex items-center gap-1">
                {quickLoggingRole === 'buyer@venma.com' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <span>Buyer</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Shared Demo Password Section */}
          <div className="pt-2.5 border-t border-[#E7DFD5]/60 dark:border-[#333338] flex items-center justify-between gap-2 text-xs">
            <div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                <Lock className="w-3 h-3 text-[#C67C4E]" />
                <span>Shared Demo Password</span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                Works for all three demo accounts.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <code className="px-2 py-1 rounded-md bg-white dark:bg-[#121214] border border-[#DDD6CE] dark:border-[#3A3A40] text-[11px] font-mono font-bold text-slate-800 dark:text-slate-100 select-all">
                password123
              </code>
              <button
                type="button"
                onClick={handleCopyPassword}
                title="Copy demo password"
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
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

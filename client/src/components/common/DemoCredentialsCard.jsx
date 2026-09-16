import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Store, User, Lock, ArrowRight, Copy, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DemoCredentialsCard({ onQuickLogin, activeLoadingRole, title = "Platform Demonstration Credentials" }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const [copied, setCopied] = useState(false);
  const [internalLoadingRole, setInternalLoadingRole] = useState(null);

  const currentLoadingRole = activeLoadingRole || internalLoadingRole;

  const handleCopyPassword = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('password123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleClick = async (email, rolePath) => {
    if (onQuickLogin) {
      onQuickLogin(email);
      return;
    }

    // Direct 1-click login from homepage or elsewhere if auth context login exists
    if (auth?.login) {
      setInternalLoadingRole(email);
      try {
        const user = await auth.login(email, 'password123');
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'vendor') navigate('/vendor/dashboard');
        else navigate('/');
      } catch (err) {
        navigate(`/login?email=${encodeURIComponent(email)}`);
      } finally {
        setInternalLoadingRole(null);
      }
    } else {
      navigate(`/login?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F4EFE6] dark:from-[#1E1E22] dark:to-[#161619] border border-[#E7DFD5] dark:border-[#3A3A40] shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD5]/80 dark:border-[#333338]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm tracking-wide text-slate-900 dark:text-slate-100 uppercase">
              {title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              One-click instant authentication for all marketplace roles
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C67C4E]/10 text-[#C67C4E] border border-[#C67C4E]/20">
          Live Production Demo
        </span>
      </div>

      {/* 3 Role Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Administrator */}
        <div
          onClick={() => handleRoleClick('admin@venma.com', '/admin/dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRoleClick('admin@venma.com', '/admin/dashboard')}
          className="group p-3.5 rounded-xl bg-white dark:bg-[#25252A] border border-[#E5DFD7] dark:border-[#333338] hover:border-[#C67C4E]/60 dark:hover:border-[#C67C4E]/70 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
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
          </div>
          <div className="pt-2 border-t border-[#F0EBE3] dark:border-[#2F2F35] flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Role</span>
            <span className="px-2 py-0.5 rounded-md bg-[#F8ECE3] dark:bg-[#342721] text-[#C67C4E] dark:text-[#E29D73] text-[10px] font-bold border border-[#DDD6CE] dark:border-[#44332A] group-hover:bg-[#C67C4E] group-hover:text-white transition-colors flex items-center gap-1">
              {currentLoadingRole === 'admin@venma.com' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <span>Admin</span>
                  <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </div>
        </div>

        {/* Vendor */}
        <div
          onClick={() => handleRoleClick('vendor@venma.com', '/vendor/dashboard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRoleClick('vendor@venma.com', '/vendor/dashboard')}
          className="group p-3.5 rounded-xl bg-white dark:bg-[#25252A] border border-[#E5DFD7] dark:border-[#333338] hover:border-emerald-500/60 dark:hover:border-emerald-500/70 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
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
          </div>
          <div className="pt-2 border-t border-[#F0EBE3] dark:border-[#2F2F35] flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Role</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981] text-[10px] font-bold border border-emerald-200 dark:border-emerald-900/60 group-hover:bg-[#10B981] group-hover:text-white transition-colors flex items-center gap-1">
              {currentLoadingRole === 'vendor@venma.com' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <span>Vendor</span>
                  <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </div>
        </div>

        {/* Buyer */}
        <div
          onClick={() => handleRoleClick('buyer@venma.com', '/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRoleClick('buyer@venma.com', '/')}
          className="group p-3.5 rounded-xl bg-white dark:bg-[#25252A] border border-[#E5DFD7] dark:border-[#333338] hover:border-orange-500/60 dark:hover:border-orange-500/70 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
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
          </div>
          <div className="pt-2 border-t border-[#F0EBE3] dark:border-[#2F2F35] flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Role</span>
            <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-[#F97316] text-[10px] font-bold border border-orange-200 dark:border-orange-900/60 group-hover:bg-[#F97316] group-hover:text-white transition-colors flex items-center gap-1">
              {currentLoadingRole === 'buyer@venma.com' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <span>Buyer</span>
                  <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Shared Password Section */}
      <div className="pt-3 border-t border-[#E7DFD5]/80 dark:border-[#333338] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[#C67C4E]" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              Shared Demo Password:
            </span>{' '}
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Works for all three demo accounts.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <code className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#121214] border border-[#DDD6CE] dark:border-[#3A3A40] text-xs font-mono font-bold text-slate-800 dark:text-slate-100 select-all">
            password123
          </code>
          <button
            type="button"
            onClick={handleCopyPassword}
            title="Copy shared demo password"
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

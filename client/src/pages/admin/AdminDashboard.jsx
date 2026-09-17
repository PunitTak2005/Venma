import Logo from "../../components/common/Logo";
import InitialsBadge from "../../components/common/InitialsBadge";
import { chartTooltipStyles } from "../../components/common/chartTooltipStyles";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Store,
  Users,
  Package,
  ShoppingBag,
  Download,
  Shield,
  TrendingUp,
  Percent,
  MapPin,
  Navigation,
  ExternalLink,
  Wallet,
  Landmark,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';
import { formatINRCompact, formatCompactNumber } from '../../utils/formatters';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const res = await api.get('/admin/overview');
        if (res.data?.success) {
          setOverview(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin overview');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOverview();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#C67C4E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading control center analytics...</p>
      </div>
    );
  }

  const { kpi, revenueAnalytics, commissionTransactions } = overview || {
    kpi: { totalRevenue: 0, platformCommission: 0, vendorPayouts: 0, totalOrders: 0, totalProducts: 0, totalVendors: 0, totalUsers: 0, pendingVendors: 0 },
    revenueAnalytics: [],
    commissionTransactions: [],
  };

  const formattedChartData = (revenueAnalytics || []).map((item) => ({
    ...item,
    formattedRevenue: formatINRCompact(item.revenue),
    formattedCommission: formatINRCompact(item.commission),
  }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#DDD6CE] dark:border-[#3A3A40]">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Logo size="navbar" linkTo="/admin/dashboard" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] border border-[#DDD6CE]/60 dark:border-[#3A3A40]">
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Platform Administrator
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-500 animate-pulse" />
                Platform Status: Operational
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              VENMA Marketplace Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor revenue, vendors, buyers, and platform performance in real time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/admin/reports/sales"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center space-x-2 transition active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-[#C67C4E]" />
            <span>Sales Report (PDF)</span>
          </a>
          <a
            href="/api/admin/reports/vendors"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-semibold text-xs shadow-sm flex items-center space-x-2 transition active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Vendors Report (PDF)</span>
          </a>
        </div>
      </div>

      {/* 2. Platform Headquarters Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] flex items-center justify-center shrink-0 border border-[#DDD6CE]/60 dark:border-[#3A3A40]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Registered Platform Headquarters
            </span>
            <p className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              VENMA Multi-Vendor Marketplace Inc.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
          <a
            href="https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-[#C67C4E] text-slate-700 dark:text-slate-200 hover:text-[#C67C4E] transition flex items-center space-x-2 font-semibold text-xs"
          >
            <Navigation className="w-4 h-4 text-[#C67C4E]" />
            <span>Get Directions</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </a>
        </div>
      </div>

      {/* 3. Responsive KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gross Sales */}
        <div className="bg-white dark:bg-[#1E1E20] p-6 rounded-3xl border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-[#C67C4E] flex items-center justify-center border border-amber-200/60 dark:border-amber-900/40">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.4%
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Gross Sales</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatINRCompact(kpi.totalRevenue)}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Total marketplace transaction volume</p>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white dark:bg-[#1E1E20] p-6 rounded-3xl border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-900/40">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-[#C67C4E] bg-[#F8ECE3] dark:bg-[#2B2B2F] px-2.5 py-1 rounded-full">
              <Percent className="w-3 h-3 mr-1" />
              10% Cut
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Platform Revenue</span>
            <h2 className="text-3xl font-black text-[#C67C4E] dark:text-[#D8956A] tracking-tight">
              {formatINRCompact(kpi.platformCommission)}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Net platform take-rate earnings</p>
          </div>
        </div>

        {/* Vendor Payout */}
        <div className="bg-white dark:bg-[#1E1E20] p-6 rounded-3xl border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#FCF9EE] dark:bg-[#2B2B2F] text-[#D4A24C] flex items-center justify-center border border-[#DDD6CE]/60 dark:border-[#3A3A40]">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              90% Payout
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Vendor Payout</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatINRCompact(kpi.vendorPayouts)}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Disbursed net merchant earnings</p>
          </div>
        </div>

        {/* Global Orders */}
        <div className="bg-white dark:bg-[#1E1E20] p-6 rounded-3xl border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-900/40">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
              Fulfilled
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Global Orders</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCompactNumber(kpi.totalOrders)}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Total customer checkout orders</p>
          </div>
        </div>

        {/* Verified Vendors */}
        <div className="bg-white dark:bg-[#1E1E20] p-6 rounded-3xl border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-[#D4A24C] flex items-center justify-center border border-amber-200/60 dark:border-amber-900/40">
              <Store className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full">
              Verified
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Verified Vendors</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCompactNumber(kpi.totalVendors)}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Approved merchant storefronts</p>
          </div>
        </div>

        {/* Active Buyers */}
        <div className="bg-white dark:bg-[#1E1E20] p-6 rounded-3xl border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-900/40">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full">
              Registered
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Buyers</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCompactNumber(kpi.totalUsers)}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Registered customer accounts</p>
          </div>
        </div>
      </div>

      {/* 4. Chart Section */}
      <div className="bg-white dark:bg-[#1E1E20] rounded-3xl p-6 sm:p-8 border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Gross Volume vs Platform Take-Rate Trajectory</h3>
            <p className="text-xs text-slate-400">Monthly breakdown of gross GMV and 10% platform earnings</p>
          </div>
          <span className="inline-flex items-center text-xs font-bold text-[#C67C4E] bg-[#F8ECE3] dark:bg-[#2B2B2F] px-3 py-1.5 rounded-full self-start sm:self-auto">
            <TrendingUp className="w-4 h-4 mr-1.5" />
            +24.1% Runrate
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => formatINRCompact(val)}
              />
              <Tooltip
                formatter={(val) => [formatINRCompact(val), 'Amount']}
                {...chartTooltipStyles}
              />
              <Bar dataKey="revenue" fill="#1C1C1E" radius={[8, 8, 0, 0]} name="Gross GMV" />
              <Bar dataKey="commission" fill="#C67C4E" radius={[8, 8, 0, 0]} name="Platform Take-Rate (10%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Commission Ledger Table */}
      {commissionTransactions?.length > 0 && (
        <div className="bg-white dark:bg-[#1E1E20] rounded-3xl border border-[#DDD6CE] dark:border-[#3A3A40] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#DDD6CE]/60 dark:border-[#3A3A40]/60">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Multi-Vendor Commission Allocations</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated 10% platform cut and 90% vendor payout split</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#121212]/60 border-b border-[#DDD6CE] dark:border-[#3A3A40] text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-black">
                <tr>
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Vendor Store</th>
                  <th className="px-6 py-4">Gross Slice</th>
                  <th className="px-6 py-4">Platform Cut (10%)</th>
                  <th className="px-6 py-4">Vendor Net (90%)</th>
                  <th className="px-6 py-4 text-right">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD6CE]/60 dark:divide-[#3A3A40]/60">
                {commissionTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[#F8ECE3]/40 dark:hover:bg-[#2B2B2F] transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#C67C4E]">#{tx.orderNumber}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center space-x-2.5">
                        <InitialsBadge name={tx.vendorStoreName} />
                        <span>{tx.vendorStoreName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{formatINRCompact(tx.grossAmount)}</td>
                    <td className="px-6 py-4 font-bold text-[#C67C4E]">{formatINRCompact(tx.platformFee)}</td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{formatINRCompact(tx.vendorAmount)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#F8ECE3] text-[#C67C4E] dark:bg-[#2B2B2F] dark:text-[#D8956A]">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Quick Access Governance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/admin/vendors"
          className="p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] hover:border-[#C67C4E] transition shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#C67C4E] transition">
              Vendor Governance
            </h4>
            <p className="text-xs text-slate-400 mt-1">Review merchant compliance, approve or suspend stores with one click</p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-[#C67C4E]">
            <span>Manage Merchants</span>
            <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/admin/customers"
          className="p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] hover:border-[#C67C4E] transition shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#C67C4E] transition">
              Customer Database
            </h4>
            <p className="text-xs text-slate-400 mt-1">Manage 100+ registered buyer accounts and order histories</p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-[#C67C4E]">
            <span>View Customers</span>
            <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/products"
          className="p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] hover:border-[#C67C4E] transition shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-[#C67C4E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#C67C4E] transition">
              Product Catalog
            </h4>
            <p className="text-xs text-slate-400 mt-1">Moderate listings, toggle featured badges, inspect vendor tags</p>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-[#C67C4E]">
            <span>Explore Catalog</span>
            <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}

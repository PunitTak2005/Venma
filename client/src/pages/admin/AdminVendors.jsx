import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Store,
  CheckCircle2,
  Clock,
  Ban,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ExternalLink,
  Star,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Check,
  AlertCircle,
  Package,
  Mail,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import InitialsBadge from '../../components/common/InitialsBadge';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('revenue_desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  const fetchVendors = async () => {
    try {
      const res = await api.get('/admin/vendors');
      if (res.data.success) {
        setVendors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load vendors', err);
      showToast('Failed to load marketplace vendors', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleUpdateStatus = async (vendorId, status) => {
    setUpdatingId(vendorId);
    try {
      await api.put(`/admin/vendors/${vendorId}/status`, { status });
      showToast(`Vendor successfully marked as ${status}`, 'success');
      await fetchVendors();
    } catch (err) {
      console.error('Status update failed', err);
      showToast('Status update failed. Please try again.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Summary Metrics
  const stats = useMemo(() => {
    const total = vendors.length;
    const approved = vendors.filter((v) => v.status === 'approved').length;
    const pending = vendors.filter((v) => v.status === 'pending').length;
    const suspended = vendors.filter((v) => v.status === 'suspended').length;
    const totalRevenue = vendors.reduce((sum, v) => sum + Number(v.totalRevenue || 0), 0);
    return { total, approved, pending, suspended, totalRevenue };
  }, [vendors]);

  // Filtered & Sorted Vendors
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          v.storeName?.toLowerCase().includes(query) ||
          v.storeSlug?.toLowerCase().includes(query) ||
          v.user?.name?.toLowerCase().includes(query) ||
          v.user?.email?.toLowerCase().includes(query) ||
          v.specialty?.toLowerCase().includes(query) ||
          v.location?.toLowerCase().includes(query) ||
          v.address?.city?.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'revenue_desc') return Number(b.totalRevenue || 0) - Number(a.totalRevenue || 0);
        if (sortBy === 'rating_desc') return Number(b.rating || 0) - Number(a.rating || 0);
        if (sortBy === 'products_desc') return Number(b.totalProducts || 0) - Number(a.totalProducts || 0);
        if (sortBy === 'name_asc') return (a.storeName || '').localeCompare(b.storeName || '');
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return 0;
      });
  }, [vendors, searchTerm, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#C67C4E] animate-spin"></div>
          <Store className="w-5 h-5 text-[#C67C4E] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading marketplace vendors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] border border-[#C67C4E]/20">
              <Store className="w-3.5 h-3.5 mr-1" />
              Merchant Directory
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {stats.total} Total Registered
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            Vendors Governance & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Audit store profiles, manage moderation approvals, enforce compliance, and inspect multi-vendor merchant performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchVendors}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm active:scale-95"
            title="Refresh vendor list"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500 dark:text-slate-400" />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1C1C1E] dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 transition-all shadow-sm active:scale-95"
          >
            <span>Admin Center</span>
          </Link>
        </div>
      </div>

      {/* 2. Premium KPI Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Vendors */}
        <div className="group p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#C67C4E]/40 dark:hover:border-[#C67C4E]/40 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Stores</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.total}</div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center">
              <Sparkles className="w-3 h-3 text-[#C67C4E] mr-1 inline" />
              Active on marketplace
            </p>
          </div>
        </div>

        {/* Approved Vendors */}
        <div className="group p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Approved</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.approved}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400/90 mt-0.5 font-medium">
              Verified & publishing
            </p>
          </div>
        </div>

        {/* Pending Moderation */}
        <div className="group p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.pending}</div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400/90 mt-0.5 font-medium">
              Awaiting review
            </p>
          </div>
        </div>

        {/* Suspended Vendors */}
        <div className="group p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Suspended</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.suspended}</div>
            <p className="text-[11px] text-rose-600 dark:text-rose-400/90 mt-0.5 font-medium">
              Storefronts halted
            </p>
          </div>
        </div>

        {/* Total Gross Volume */}
        <div className="group p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#C67C4E]/40 dark:hover:border-[#C67C4E]/40 transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#C67C4E] dark:text-[#E09B6F] uppercase tracking-wider">Gross Volume</span>
            <div className="w-9 h-9 rounded-xl bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 flex items-center justify-center text-[#C67C4E] dark:text-[#E09B6F] group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center">
              All merchant sales
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search, Filter Chips, Sort & View Controls */}
      <div className="bg-white dark:bg-slate-900/95 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input with theme-aware styling */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by store name, slug, owner, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#C67C4E] dark:focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'approved', label: 'Approved', count: stats.approved },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'suspended', label: 'Suspended', count: stats.suspended },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#1C1C1E] dark:bg-slate-800 text-white shadow-sm ring-1 ring-slate-300 dark:ring-slate-700'
                      : 'bg-slate-100/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort & View Toggle Controls */}
          <div className="flex items-center gap-2.5 justify-between lg:justify-end">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#C67C4E] focus:ring-1 focus:ring-[#C67C4E]/30"
              >
                <option value="revenue_desc">Highest Revenue</option>
                <option value="rating_desc">Highest Rating</option>
                <option value="products_desc">Most Products</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* View Switcher: Table vs Cards */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-[#C67C4E] shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-[#C67C4E] shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Cards View"
                aria-label="Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Vendors Display (Table View OR Cards View) */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm">
          <Store className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No merchant records found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No vendors match your search query or selected status filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#1C1C1E] dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800 z-10">
                <tr>
                  <th className="px-6 py-4">Store Identity</th>
                  <th className="px-6 py-4">Account Owner</th>
                  <th className="px-6 py-4">Catalog & Rating</th>
                  <th className="px-6 py-4">Gross Revenue</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVendors.map((v) => {
                  const isUpdating = updatingId === v._id;
                  const isApproved = v.status === 'approved';
                  const isSuspended = v.status === 'suspended';
                  const isPending = v.status === 'pending';

                  return (
                    <tr
                      key={v._id}
                      className="group bg-white dark:bg-slate-900 hover:bg-slate-50/90 dark:hover:bg-slate-800/80 transition-colors duration-200"
                    >
                      {/* Store Identity */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center space-x-3.5">
                          <div className="relative group-hover:scale-105 transition-transform duration-200">
                            <InitialsBadge
                              name={v.storeName}
                              className="ring-2 ring-transparent group-hover:ring-[#C67C4E]/40"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-slate-900 dark:text-white block group-hover:text-[#C67C4E] transition-colors">
                                {v.storeName}
                              </span>
                              <Link
                                to={`/vendors/${v.storeSlug || v._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-[#C67C4E] dark:hover:text-[#C67C4E] p-0.5 rounded transition"
                                title="View storefront in new tab"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              <span className="font-mono text-slate-400 dark:text-slate-500">/{v.storeSlug}</span>
                              {(v.location || v.address?.city) && (
                                <span className="inline-flex items-center text-slate-500 dark:text-slate-400">
                                  <span className="mx-1">•</span>
                                  <MapPin className="w-3 h-3 text-[#C67C4E] mr-1 flex-shrink-0" />
                                  <span className="truncate max-w-[140px]">
                                    {v.location || `${v.address.city}, ${v.address.state}`}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner Account */}
                      <td className="px-6 py-4.5">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                            {v.user?.name || 'Unassigned User'}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-mono">
                            {v.user?.email || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Rating & Catalog */}
                      <td className="px-6 py-4.5">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{v.rating || '4.8'}</span>
                            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                              ({v.numReviews || 0} reviews)
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                            <Package className="w-3 h-3 text-slate-400" />
                            <span>{v.totalProducts || 0} products</span>
                          </div>
                        </div>
                      </td>

                      {/* Gross Revenue */}
                      <td className="px-6 py-4.5">
                        <div className="font-black text-slate-900 dark:text-white text-sm">
                          ₹{Number(v.totalRevenue || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">Total volume</div>
                      </td>

                      {/* Status Badge with theme-aware high contrast */}
                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                            isApproved
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                              : isSuspended
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              isApproved ? 'bg-emerald-500' : isSuspended ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                          />
                          {v.status}
                        </span>
                      </td>

                      {/* Moderation Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="inline-flex items-center space-x-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(v._id, 'approved')}
                                disabled={isUpdating}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 dark:text-emerald-300 dark:border-emerald-500/30 font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
                              >
                                {isUpdating ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(v._id, 'suspended')}
                                disabled={isUpdating}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 dark:border-rose-500/30 font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40 disabled:opacity-50"
                              >
                                {isUpdating ? '...' : 'Reject'}
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => handleUpdateStatus(v._id, 'suspended')}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 dark:border-rose-500/30 font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40 disabled:opacity-50"
                            >
                              {isUpdating ? 'Updating...' : 'Suspend'}
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              onClick={() => handleUpdateStatus(v._id, 'approved')}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 dark:text-emerald-300 dark:border-emerald-500/30 font-bold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50"
                            >
                              {isUpdating ? 'Updating...' : 'Reactivate'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS / GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((v) => {
            const isUpdating = updatingId === v._id;
            const isApproved = v.status === 'approved';
            const isSuspended = v.status === 'suspended';
            const isPending = v.status === 'pending';

            return (
              <div
                key={v._id}
                className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-[#C67C4E]/50 dark:hover:border-[#C67C4E]/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Card Bar: Logo, Name & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="group-hover:scale-105 transition-transform">
                        <InitialsBadge name={v.storeName} className="ring-2 ring-transparent group-hover:ring-[#C67C4E]/40" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#C67C4E] transition-colors line-clamp-1">
                          {v.storeName}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block">
                          /{v.storeSlug}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        isApproved
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : isSuspended
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  {/* Owner & City */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{v.user?.name || 'Merchant Owner'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{v.user?.email || 'No email attached'}</span>
                    </div>
                    {(v.location || v.address?.city) && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-[#C67C4E]" />
                        <span className="truncate">{v.location || `${v.address.city}, ${v.address.state}`}</span>
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics Pills */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Rating</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-0.5 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{v.rating || '4.8'}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Products</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {v.totalProducts || 0}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Revenue</div>
                      <div className="text-xs font-bold text-[#C67C4E] dark:text-[#E09B6F] mt-0.5 truncate">
                        ₹{Number(v.totalRevenue || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <Link
                    to={`/vendors/${v.storeSlug || v._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1 transition"
                  >
                    <span>Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center space-x-1.5">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(v._id, 'approved')}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 dark:text-emerald-300 dark:border-emerald-500/30 font-bold text-xs transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(v._id, 'suspended')}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 dark:border-rose-500/30 font-bold text-xs transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => handleUpdateStatus(v._id, 'suspended')}
                        disabled={isUpdating}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-300 dark:border-rose-500/30 font-bold text-xs transition"
                      >
                        {isUpdating ? 'Updating...' : 'Suspend Store'}
                      </button>
                    )}

                    {isSuspended && (
                      <button
                        onClick={() => handleUpdateStatus(v._id, 'approved')}
                        disabled={isUpdating}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 dark:text-emerald-300 dark:border-emerald-500/30 font-bold text-xs transition"
                      >
                        {isUpdating ? 'Updating...' : 'Reactivate Store'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtle Toast Feedback Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-200 border-rose-800/80 shadow-rose-950/40'
              : 'bg-slate-900/95 text-white border-slate-700/80 shadow-black/40'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold tracking-wide">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

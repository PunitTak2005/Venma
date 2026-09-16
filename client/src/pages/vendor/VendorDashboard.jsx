import Logo from "../../components/common/Logo";
import InitialsBadge from "../../components/common/InitialsBadge";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  PlusCircle,
  Tag,
  BarChart3,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  MapPin,
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

export default function VendorDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        const [statRes, orderRes, prodRes] = await Promise.all([
          api.get('/vendors/me/stats'),
          api.get('/vendors/me/orders'),
          api.get('/vendors/me/products'),
        ]);

        if (statRes.data.success) {
          setStats(statRes.data.data);
        }
        if (orderRes.data.success) {
          setRecentOrders(orderRes.data.data.slice(0, 5));
        }
        if (prodRes.data.success) {
          setLowStockProducts(prodRes.data.data.filter((p) => p.stock <= 15).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load vendor dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchVendorStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading merchant analytics...</p>
      </div>
    );
  }

  const { vendor, kpi, monthlyStats } = stats || {
    vendor: {},
    kpi: { revenue: 0, balance: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, conversionRate: '3.4%' },
    monthlyStats: [],
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Top Banner with Store Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <Logo size="navbar" linkTo="/vendor/dashboard" />
          <div>
            <div className="flex items-center space-x-2.5">
              <InitialsBadge name={vendor?.storeName || 'Merchant'} />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {vendor?.storeName || 'Merchant Dashboard'}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {vendor?.status || 'Active'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
              {(vendor?.location || vendor?.address?.city) && (
                <span className="inline-flex items-center text-slate-600 dark:text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C67C4E] mr-1 flex-shrink-0" />
                  <span>{vendor.location || `${vendor.address.city}, ${vendor.address.state}`}</span>
                  <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                </span>
              )}
              <span>Real-time fulfillment metrics, balance payouts, and order telemetry.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/vendors/${vendor?.storeSlug || vendor?._id}`}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1 hover:bg-slate-200 transition"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </Link>
          <Link
            to="/vendor/products/new"
            className="px-5 py-2 rounded-xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs shadow-md shadow-[#C67C4E]/20 flex items-center space-x-1.5 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-[20px] p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-200">Inventory Alert</h4>
              <p className="text-amber-700 dark:text-amber-300">
                {lowStockProducts.length} product(s) in your store are reaching low inventory thresholds (15 units or fewer).
              </p>
            </div>
          </div>
          <Link
            to="/vendor/products"
            className="px-4 py-1.5 rounded-xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs shadow-sm transition"
          >
            Manage Stock
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white dark:bg-[#1E1E20] p-5 rounded-[20px] border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-[#F8ECE3] text-[#C67C4E] flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales</span>
          <h3 className="text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">₹{Number(kpi.revenue || 0).toLocaleString('en-IN')}</h3>
        </div>

        <div className="bg-white dark:bg-[#1E1E20] p-5 rounded-[20px] border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-[#FCF9EE] text-[#D4A24C] flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Balance</span>
          <h3 className="text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">₹{Number(kpi.balance || 0).toLocaleString('en-IN')}</h3>
        </div>

        <div className="bg-white dark:bg-[#1E1E20] p-5 rounded-[20px] border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-[#F8ECE3] text-[#C67C4E] flex items-center justify-center mb-2">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
          <h3 className="text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">{kpi.totalOrders}</h3>
        </div>

        <div className="bg-white dark:bg-[#1E1E20] p-5 rounded-[20px] border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-[#FCF9EE] text-[#D4A24C] flex items-center justify-center mb-2">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Products</span>
          <h3 className="text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">{kpi.totalProducts}</h3>
        </div>

        <div className="bg-white dark:bg-[#1E1E20] p-5 rounded-[20px] border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm space-y-1">
          <div className="w-9 h-9 rounded-xl bg-[#F8ECE3] text-[#C67C4E] flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
          <h3 className="text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">{kpi.conversionRate}</h3>
        </div>
      </div>

      {/* Recharts Analytics Bar Chart */}
      <div className="bg-white dark:bg-[#1E1E20] rounded-[20px] p-6 sm:p-8 border border-[#DDD6CE]/80 dark:border-[#3A3A40] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#1C1C1E] dark:text-[#F8F7F5]">Monthly Sales Trajectory</h3>
            <p className="text-xs text-slate-400">Live revenue distribution over preceding periods</p>
          </div>
          <span className="text-xs font-bold text-[#C67C4E] flex items-center">
            <BarChart3 className="w-4 h-4 mr-1" />
            +18.4% YoY Growth
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1C1E',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#C67C4E" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Navigation Links & Recent Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar cards */}
        <div className="space-y-3">
          <Link
            to="/vendor/products"
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm hover:border-[#10B981] transition"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Inventory Management</h4>
              <p className="text-xs text-slate-400 mt-0.5">Manage SKU, pricing, stock levels</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/vendor/orders"
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm hover:border-[#10B981] transition"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fulfillment & Orders</h4>
              <p className="text-xs text-slate-400 mt-0.5">Mark items packed, shipped, delivered</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/vendor/coupons"
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm hover:border-[#10B981] transition"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Promotional Coupons</h4>
              <p className="text-xs text-slate-400 mt-0.5">Create custom merchant discount codes</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[20px] p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Store Orders</h3>
            <Link to="/vendor/orders" className="text-xs font-bold text-[#10B981] hover:underline">
              View All ({recentOrders.length})
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    #{order.orderNumber}
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    Customer: {order.customer?.name || 'Customer'} • {order.items.length} item(s)
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 dark:text-white block">
                    ₹{Number(order.totalVendorAmount || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#F8ECE3] text-[#C67C4E] dark:bg-[#C67C4E]/20">
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

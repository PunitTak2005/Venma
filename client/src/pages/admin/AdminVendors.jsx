import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import api from '../../services/api';
import InitialsBadge from '../../components/common/InitialsBadge';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/admin/vendors');
      if (res.data.success) {
        setVendors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleUpdateStatus = async (vendorId, status) => {
    try {
      await api.put(`/admin/vendors/${vendorId}/status`, { status });
      fetchVendors();
    } catch (err) {
      console.error('Status update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendors Management</h1>
          <p className="text-sm text-slate-500">Monitor marketplace sellers and moderation</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3.5">Store Details</th>
                <th className="px-6 py-3.5">Owner Account</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Gross Revenue</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {vendors.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <InitialsBadge name={v.storeName} />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{v.storeName}</span>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span>/{v.storeSlug}</span>
                          {(v.location || v.address?.city) && (
                            <span className="inline-flex items-center text-slate-500 dark:text-slate-400">
                              <span className="mx-1">•</span>
                              <MapPin className="w-3 h-3 text-[#C67C4E] mr-1 flex-shrink-0" />
                              <span>{v.location || `${v.address.city}, ${v.address.state}`}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{v.user?.name}</span>
                    <span className="text-slate-400 text-[11px]">{v.user?.email}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                    ★ {v.rating} ({v.numReviews})
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                    ₹{Number(v.totalRevenue || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'suspended'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {v.status !== 'approved' ? (
                      <button
                        onClick={() => handleUpdateStatus(v._id, 'approved')}
                        className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#10B981] font-bold text-xs"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(v._id, 'suspended')}
                        className="px-3 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

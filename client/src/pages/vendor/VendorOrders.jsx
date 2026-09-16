import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, FileText } from 'lucide-react';
import api from '../../services/api';
import orderService from '../../services/orderService';

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceError, setInvoiceError] = useState('');

  const handleInvoiceDownload = async (orderId) => {
    setInvoiceError('');
    try {
      await orderService.downloadInvoice(orderId);
    } catch (err) {
      setInvoiceError(err.response?.status === 401 ? 'Your session has expired. Please log in again.' : 'Unable to download invoice.');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/vendors/me/orders');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load vendor orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {invoiceError && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{invoiceError}</p>}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Store Order Fulfillment</h1>
        <p className="text-xs text-slate-400 mt-1">Manage vendor-specific dispatches, packing updates, and customer invoices</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                  #{order.orderNumber}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">CUSTOMER</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {order.customer?.name} ({order.shippingAddress?.city}, {order.shippingAddress?.state})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">STORE EARNINGS</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  ₹{Number(order.totalVendorAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Packed / Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleInvoiceDownload(order._id)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-[#C67C4E]"
                  title="Print Invoice"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                      <span className="text-slate-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

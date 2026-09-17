import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FileText,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
  Store,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api';
import orderService from '../../services/orderService';

export default function Orders() {
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/myorders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">DELIVERED</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8ECE3] text-[#C67C4E] dark:bg-[#C67C4E]/20">SHIPPED</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">PROCESSING</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">PENDING</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#C67C4E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Order History & Shipment Tracking</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review past multi-vendor purchases, track shipment timelines, and download digital A4 PDF invoices.
        </p>
      </div>
      {invoiceError && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{invoiceError}</p>}

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 mt-1">When you place orders, they will appear here with full invoice tracking.</p>
          <Link
            to="/products"
            className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white text-xs font-bold shadow transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-black text-slate-900 dark:text-white text-base">
                    ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                  {/* PDF Invoice Download */}
                  <button
                    type="button"
                    onClick={() => handleInvoiceDownload(order._id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C67C4E]" />
                    <span>Download Invoice (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Items in Order with Individual Vendor Tracking */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 gap-2 text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <span className="text-slate-400">Qty: {item.quantity} • ₹{Number(item.price || 0).toLocaleString('en-IN')} each</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-auto">
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#10B981] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        <Truck className="w-3 h-3" />
                        <span className="capitalize">{item.status || order.orderStatus}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Timeline */}
              {order.trackingTimeline && order.trackingTimeline.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Shipment Timeline
                  </h4>
                  <div className="space-y-2">
                    {order.trackingTimeline.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-[#C67C4E] mt-1.5" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{step.status}</p>
                          <p className="text-[11px] text-slate-400">{step.note} • {new Date(step.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

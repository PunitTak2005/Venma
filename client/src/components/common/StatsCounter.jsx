import React, { useState, useEffect } from 'react';
import { Package, Store, Layers, ShoppingBag } from 'lucide-react';
import api from '../../services/api';

/**
 * AnimatedCounter component performs a smooth 800-1200ms ease-out cubic animation
 * from 0 up to the target live database value.
 */
function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const end = Number(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }

    let animationFrameId;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: 1 - (1 - progress)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function StatsCounter() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalVendors: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveMetrics = async () => {
      try {
        // Fetch real live metrics aggregated directly from database
        const res = await api.get('/public/metrics');
        if (res.data.success && isMounted) {
          setMetrics({
            totalProducts: res.data.data.totalProducts || 0,
            totalVendors: res.data.data.totalVendors || 0,
            totalCategories: res.data.data.totalCategories || 8,
            totalOrders: res.data.data.totalOrders || 0,
          });
        }
      } catch (err) {
        console.error('Failed to load live metrics from /public/metrics, attempting /products/count fallback', err);
        try {
          const countRes = await api.get('/products/count');
          if (countRes.data.success && isMounted) {
            setMetrics((prev) => ({
              ...prev,
              totalProducts: countRes.data.count || 0,
            }));
          }
        } catch (fallbackErr) {
          console.error('Fallback count also failed', fallbackErr);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLiveMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  const statsConfig = [
    {
      id: 'products',
      value: metrics.totalProducts,
      label: 'Curated Products',
      icon: Package,
      iconBg: 'bg-[#C67C4E]/20 text-[#C67C4E]',
    },
    {
      id: 'vendors',
      value: metrics.totalVendors,
      label: 'Verified Merchants',
      icon: Store,
      iconBg: 'bg-[#C67C4E]/20 text-[#C67C4E]',
    },
    {
      id: 'categories',
      value: metrics.totalCategories,
      label: 'Retail Categories',
      icon: Layers,
      iconBg: 'bg-[#D4A24C]/20 text-[#D4A24C]',
    },
    {
      id: 'orders',
      value: metrics.totalOrders,
      label: 'Completed Deliveries',
      icon: ShoppingBag,
      iconBg: 'bg-[#C67C4E]/20 text-[#C67C4E]',
    },
  ];

  return (
    <section className="container mx-auto px-4" aria-label="Live Marketplace Statistics">
      <div className="rounded-3xl bg-[#1C1C1E] text-[#F8F7F5] p-8 sm:p-10 border border-[#3A3A40] shadow-[0_10px_30px_rgba(28,28,30,0.08)]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] font-bold text-[#C67C4E] uppercase tracking-widest bg-[#C67C4E]/15 px-3 py-1 rounded-full border border-[#C67C4E]/30">
            Marketplace Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white">Scale &amp; Performance at a Glance</h2>
          <p className="text-xs text-slate-400 mt-1">Live metrics aggregated straight from our production database</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statsConfig.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="p-5 rounded-2xl bg-[#1E1E20] border border-[#3A3A40] space-y-1 min-h-[140px] flex flex-col justify-center"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="h-9 flex items-center justify-center">
                  {loading ? (
                    <div className="h-8 w-20 bg-slate-700/50 rounded-xl animate-pulse" />
                  ) : (
                    <h3 className="text-3xl font-black text-white tracking-tight">
                      <AnimatedCounter value={stat.value} duration={1000} />
                    </h3>
                  )}
                </div>

                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

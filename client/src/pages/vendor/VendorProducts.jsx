import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Package, Search } from 'lucide-react';
import api from '../../services/api';
import Tooltip from '../../components/common/Tooltip';

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/vendors/me/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Store Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">Manage all listings, SKU codes, pricing, and stock levels</p>
        </div>

        <Link
          to="/vendor/products/new"
          className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center bg-white dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2 mr-2" />
        <input
          type="text"
          placeholder="Filter by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 dark:text-white focus:outline-none"
        />
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading products inventory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No products found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search filter or add a new product listing.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Stock</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{product.sku}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{product.category?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{Number(product.price).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${product.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Tooltip content="Edit Product" position="top">
                        <Link
                          to={`/vendor/products/edit/${product._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#C67C4E] hover:bg-[#F8ECE3] dark:hover:bg-[#2B2B2F] transition inline-block mr-1"
                          aria-label="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Tooltip>
                      <Tooltip content="Delete Product" position="top">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          aria-label="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

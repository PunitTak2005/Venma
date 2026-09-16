import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, CheckCircle2, Upload } from 'lucide-react';
import api from '../../services/api';

export default function VendorAddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '15',
    sku: '',
    brand: '',
    images: '/generated-products/accessories/chronograph-watch-main.webp, /generated-products/accessories/chronograph-watch-angle.webp',
    specKey1: 'Material',
    specVal1: 'Precision Engineered Alloy',
    specKey2: 'Warranty',
    specVal2: '1 Year Manufacturer Limited',
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success && res.data.data.length > 0) {
          setCategories(res.data.data);
          if (!isEditMode) {
            setFormData((prev) => ({ ...prev, category: res.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, [isEditMode]);

  useEffect(() => {
    if (!id) return;
    const fetchProductDetails = async () => {
      setFetching(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success && res.data.data) {
          const product = res.data.data;
          setFormData({
            name: product.name || '',
            description: product.description || '',
            category: product.category?._id || product.category || '',
            price: product.price !== undefined ? String(product.price) : '',
            discountPrice: product.discountPrice ? String(product.discountPrice) : '',
            stock: product.stock !== undefined ? String(product.stock) : '0',
            sku: product.sku || '',
            brand: product.brand || '',
            images: Array.isArray(product.images) && product.images.length > 0 ? product.images.join(', ') : '',
            specKey1: product.specifications?.[0]?.key || 'Material',
            specVal1: product.specifications?.[0]?.value || '',
            specKey2: product.specifications?.[1]?.key || 'Warranty',
            specVal2: product.specifications?.[1]?.value || '',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details for editing');
      } finally {
        setFetching(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        stock: Number(formData.stock),
        sku: formData.sku || undefined,
        brand: formData.brand || undefined,
        images: formData.images.split(',').map((url) => url.trim()).filter(Boolean),
        specifications: [
          { key: formData.specKey1, value: formData.specVal1 },
          { key: formData.specKey2, value: formData.specVal2 },
        ],
      };

      if (isEditMode) {
        const res = await api.put(`/products/${id}`, payload);
        if (res.data.success) {
          navigate('/vendor/products');
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.data.success) {
          navigate('/vendor/products');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Product Listing' : 'Create New Product Listing'}
          </h1>
          <p className="text-xs text-slate-400">
            {isEditMode ? 'Update photos, pricing, specifications, and inventory counts' : 'Add high quality photos, specifications, and set inventory counts'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-xs text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Product Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Apex Mechanical Keyboard Wireless Edition"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-slate-500 mb-1">Description</label>
          <textarea
            rows="4"
            required
            placeholder="Detailed description of features, durability, and aesthetics..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Brand Name</label>
            <input
              type="text"
              placeholder="e.g. TechNova Labs"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">Price (₹)</label>
            <input
              type="number"
              step="1"
              required
              placeholder="1499"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">Discount Price (₹, Optional)</label>
            <input
              type="number"
              step="1"
              placeholder="1199"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">Initial Stock Count</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-500 mb-1">Image URLs (comma separated for multiple)</label>
          <input
            type="text"
            required
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
          />
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">Specifications</span>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.specKey1}
              onChange={(e) => setFormData({ ...formData, specKey1: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
            <input
              type="text"
              value={formData.specVal1}
              onChange={(e) => setFormData({ ...formData, specVal1: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
            <input
              type="text"
              value={formData.specKey2}
              onChange={(e) => setFormData({ ...formData, specKey2: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
            <input
              type="text"
              value={formData.specVal2}
              onChange={(e) => setFormData({ ...formData, specVal2: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading || fetching}
            className="px-8 py-3 rounded-2xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition disabled:opacity-50"
          >
            {loading
              ? (isEditMode ? 'Saving Changes...' : 'Publishing Product...')
              : (isEditMode ? 'Save Changes' : 'Publish Product Listing')}
          </button>
        </div>
      </form>
    </div>
  );
}

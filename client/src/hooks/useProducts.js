import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchProducts = useCallback(async (params = initialParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(initialParams)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, pagination, refetch: fetchProducts };
}

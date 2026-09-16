import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/reviews/product/' + productId);
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetch: fetchReviews };
}

import api from './api';

export const categoryService = {
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

  getCategoryBySlug: async (slug) => {
    const res = await api.get('/categories/' + slug);
    return res.data;
  },

  getFeaturedProductsByCategory: async () => {
    const res = await api.get('/categories/featured-products');
    return res.data;
  },
};


export const dashboardService = {
  getAdminOverview: async () => {
    const res = await api.get('/admin/overview');
    return res.data;
  },

  getPublicMetrics: async () => {
    const res = await api.get('/public/metrics');
    return res.data;
  },
};

import api from './api';

export const vendorService = {
  getVendors: async (params = {}) => {
    const res = await api.get('/vendors', { params });
    return res.data;
  },

  getVendorBySlug: async (slug) => {
    const res = await api.get('/vendors/' + slug);
    return res.data;
  },

  getVendorProducts: async (slugOrId, params = {}) => {
    const res = await api.get('/vendors/' + slugOrId + '/products', { params });
    return res.data;
  },

  followVendor: async (vendorId) => {
    const res = await api.post(`/vendors/${vendorId}/follow`);
    return res.data;
  },

  unfollowVendor: async (vendorId) => {
    const res = await api.delete(`/vendors/${vendorId}/follow`);
    return res.data;
  },

  getFollowStatus: async (vendorId) => {
    const res = await api.get(`/vendors/${vendorId}/follow-status`);
    return res.data;
  },

  getMyVendorProfile: async () => {
    const res = await api.get('/vendors/me/profile');
    return res.data;
  },

  getMyProducts: async () => {
    const res = await api.get('/vendors/me/products');
    return res.data;
  },

  getMyDashboardStats: async () => {
    const res = await api.get('/vendors/me/dashboard');
    return res.data;
  },

  updateVendorProfile: async (profileData) => {
    const res = await api.put('/vendors/me/profile', profileData);
    return res.data;
  },
};

export default vendorService;

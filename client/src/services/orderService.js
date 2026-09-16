import api from './api';

export const orderService = {
  createOrder: async (orderPayload) => {
    const res = await api.post('/orders', orderPayload);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders/myorders');
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await api.get('/orders/' + id);
    return res.data;
  },

  getVendorOrders: async () => {
    const res = await api.get('/orders/vendor/orders');
    return res.data;
  },

  updateVendorOrderStatus: async (orderId, itemId, status) => {
    const res = await api.put('/orders/vendor/' + orderId + '/item/' + itemId, { status });
    return res.data;
  },

  downloadInvoice: async (orderId) => {
    const res = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    const contentDisposition = res.headers['content-disposition'] || '';
    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    const filename = filenameMatch?.[1] || `VENMA-Invoice-${orderId}.pdf`;
    const url = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default orderService;

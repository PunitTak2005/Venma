import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('venma_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('venma_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('venma_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('venma_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('venma_coupon');
    }
  }, [coupon]);

  const addToCart = (product, quantity = 1) => {
    const maxStock = Number.isFinite(product.stock) ? product.stock : 99;
    const requestedQty = Math.max(1, Math.min(Number(quantity) || 1, maxStock));

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + requestedQty, maxStock) }
            : item
        );
      }
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      const image = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : (product.thumbnail || '');
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price,
          originalPrice: product.price,
          image,
          stock: maxStock,
          vendor: product.vendor,
          quantity: requestedQty,
        },
      ];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;
        const maxStock = Number.isFinite(item.stock) ? item.stock : 99;
        return { ...item, quantity: Math.min(Number(quantity) || 1, maxStock) };
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const subtotal = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  const shippingFee = subtotal === 0 ? 0 : subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);

  let discount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
  }
  discount = Math.round(discount);

  const total = Math.max(0, subtotal + tax + shippingFee - discount);

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', { code, cartTotal: subtotal });
      if (res.data.success) {
        setCoupon(res.data.data);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid coupon code',
      };
    }
  };

  const removeCoupon = () => setCoupon(null);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        shippingFee,
        tax,
        discount,
        total,
        coupon,
        applyCoupon,
        removeCoupon,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

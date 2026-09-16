import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await api.get('/wishlist');
          if (res.data.success) {
            setWishlist(res.data.data);
          }
        } catch (err) {
          console.error('Failed to fetch wishlist', err);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Please log in to manage your wishlist' };
    try {
      const res = await api.post('/wishlist/toggle', { productId });
      if (res.data.success) {
        setWishlist(res.data.data);
        return { success: true, added: res.data.added, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: 'Wishlist update failed' };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

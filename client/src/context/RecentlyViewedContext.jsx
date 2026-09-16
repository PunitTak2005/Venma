import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('venma_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('venma_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addRecentlyViewed = (product) => {
    if (!product || !product._id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      return [
        {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          discountPrice: product.discountPrice,
          images: product.images,
          rating: product.rating,
          numReviews: product.numReviews,
          vendor: product.vendor,
          stock: product.stock,
        },
        ...filtered,
      ].slice(0, 8); // Keep up to 8 recent items
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

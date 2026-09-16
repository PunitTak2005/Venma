import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Breadcrumbs from './components/common/Breadcrumbs';

// Public Pages
import Home from './pages/public/Home';
import Categories from './pages/public/Categories';
import ProductListing from './pages/public/ProductListing';
import ProductDetails from './pages/public/ProductDetails';
import VendorsList from './pages/public/VendorsList';
import VendorStore from './pages/public/VendorStore';
import Contact from './pages/public/Contact';
import About from './pages/public/About';

// Customer Pages
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import Wishlist from './pages/customer/Wishlist';
import Profile from './pages/customer/Profile';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VendorRegister from './pages/auth/VendorRegister';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorAddProduct from './pages/vendor/VendorAddProduct';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorCoupons from './pages/vendor/VendorCoupons';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVendors from './pages/admin/AdminVendors';
import AdminCustomers from './pages/admin/AdminCustomers';

import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const VendorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && (user.role === 'vendor' || user.role === 'admin') ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'admin' ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/vendors" element={<VendorsList />} />
          <Route path="/vendors/:slug" element={<VendorStore />} />
          {/* Support both /vendor/:slug and /vendors/:slug */}
          <Route path="/vendor/:slug" element={<VendorStore />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Customer Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor/register" element={<VendorRegister />} />

          {/* Vendor Portal */}
          <Route path="/vendor/dashboard" element={<VendorRoute><VendorDashboard /></VendorRoute>} />
          <Route path="/vendor/products" element={<VendorRoute><VendorProducts /></VendorRoute>} />
          <Route path="/vendor/products/new" element={<VendorRoute><VendorAddProduct /></VendorRoute>} />
          <Route path="/vendor/products/edit/:id" element={<VendorRoute><VendorAddProduct /></VendorRoute>} />
          <Route path="/vendor/orders" element={<VendorRoute><VendorOrders /></VendorRoute>} />
          <Route path="/vendor/coupons" element={<VendorRoute><VendorCoupons /></VendorRoute>} />

          {/* Admin Console */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/vendors" element={<AdminRoute><AdminVendors /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

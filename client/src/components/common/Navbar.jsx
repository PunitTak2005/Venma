import Logo from "./Logo";
import Tooltip from "./Tooltip";
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Store,
  Shield,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Package,
  Sparkles,
  PhoneCall,
  LayoutDashboard,
  Users,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTheme } from "../../context/ThemeContext";
import SearchAutocomplete from "./SearchAutocomplete";
import NotificationBell from "./NotificationBell";
import api from "../../services/api";

export default function Navbar() {
  const { user, logout, isAdmin, isVendor } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (err) {
        console.error("Could not load categories in navbar");
      }
    };
    loadCategories();
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K opens instant search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent);

  const navLinkClass = ({ isActive }) =>
    `relative py-1 font-semibold transition-colors duration-200 group ${
      isActive
        ? "text-[#1C1C1E] dark:text-[#F8F7F5] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C67C4E] dark:after:bg-[#C67C4E] after:rounded-full"
        : "text-[#1C1C1E]/80 dark:text-[#A1A1AA] hover:text-[#C67C4E] dark:hover:text-[#F8F7F5] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#C67C4E] hover:after:rounded-full"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F2]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#DDD6CE] dark:border-[#3A3A40] transition-colors shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded font-bold text-[10px] tracking-wider uppercase">
              FESTIVE OFFER
            </span>
            <span className="truncate">
              Use code <strong className="text-white">WELCOME20</strong> for 20% off your first checkout!
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-[11px]">
            <Link to="/contact" className="hover:text-white transition flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>24/7 Helpline: +91 6367088841</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/vendor/register" className="hover:text-white transition flex items-center gap-1 font-medium text-emerald-400">
              <Store className="w-3 h-3" />
              <span>Sell on VENMA</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
          {/* Brand Logo */}
          <Logo size="navbar" linkTo="/" />

          {/* Search Trigger Input (Desktop & Tablet) */}
          <div
            onClick={() => setIsSearchModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsSearchModalOpen(true); }}
            aria-label="Search products, brands and vendors"
            className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl cursor-pointer"
          >
            <div className="flex w-full items-center rounded-full bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] px-4 py-2.5 text-xs text-slate-400 hover:border-[#C67C4E] dark:hover:border-[#C67C4E] focus-within:border-[#C67C4E] transition-all shadow-xs">
              <Search className="w-4 h-4 text-[#C67C4E] mr-2.5 shrink-0" />
              <span className="flex-1 truncate">Search products, brands, or vendors...</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F7F5F2] dark:bg-[#2B2B2F] text-[10px] font-mono text-[#6B6B70] dark:text-[#A1A1AA] border border-[#DDD6CE] dark:border-[#3A3A40] shrink-0">
                {isMac ? "⌘K" : "Ctrl K"}
              </span>
            </div>
          </div>

          {/* Action Icons & User Status */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search icon (Mobile) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Open search modal"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Dark Mode Toggle */}
            <Tooltip content={darkMode ? "Switch to light mode" : "Switch to dark mode"} position="bottom">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle theme mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
            </Tooltip>

            {/* Wishlist */}
            <Tooltip content="My Wishlist" position="bottom" wrapperClassName="hidden sm:inline-flex">
              <Link
                to="/wishlist"
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>
            </Tooltip>

            {/* Shopping Cart with Badge */}
            <Tooltip content="Shopping Cart" position="bottom">
              <Link
                to="/cart"
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#C67C4E] dark:hover:text-[#C67C4E] hover:bg-slate-100 dark:hover:bg-[#1E1E20] rounded-xl transition relative"
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C67C4E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Tooltip>

            {/* Authentication / Role-based Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer"
                >
                  {isAdmin ? (
                    <Shield className="w-7 h-7 p-1.5 rounded-lg bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E]" />
                  ) : isVendor ? (
                    <Store className="w-7 h-7 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <User className="w-7 h-7 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300" />
                  )}
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden lg:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    {/* User profile header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] uppercase tracking-wider">
                        {user.role} Account
                      </span>
                    </div>

                    {/* Customer Items */}
                    <div className="py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <User className="w-4 h-4 mr-2.5 text-slate-400" />
                        My Profile & Addresses
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <Package className="w-4 h-4 mr-2.5 text-slate-400" />
                        Order History & Tracking
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition sm:hidden"
                      >
                        <Heart className="w-4 h-4 mr-2.5 text-slate-400" />
                        My Wishlist
                      </Link>
                    </div>

                    {/* Vendor Specific Items */}
                    {isVendor && (
                      <div className="border-t border-slate-100 dark:border-slate-800 py-1 text-xs">
                        <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Vendor Portal
                        </div>
                        <Link
                          to="/vendor/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-1.5 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2.5" />
                          Dashboard Overview
                        </Link>
                        <Link
                          to="/vendor/products"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <Package className="w-4 h-4 mr-2.5 text-slate-400" />
                          Manage Products
                        </Link>
                        <Link
                          to="/vendor/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <BarChart3 className="w-4 h-4 mr-2.5 text-slate-400" />
                          Fulfillment Orders
                        </Link>
                      </div>
                    )}

                    {/* Admin Specific Items */}
                    {isAdmin && (
                      <div className="border-t border-slate-100 dark:border-slate-800 py-1 text-xs">
                        <div className="px-4 py-1 text-[10px] font-bold text-[#6B6B70] dark:text-[#A1A1AA] uppercase tracking-wider">
                          Admin Management
                        </div>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-1.5 text-[#C67C4E] dark:text-[#D8956A] font-semibold hover:bg-[#F8ECE3] dark:hover:bg-[#2B2B2F] transition"
                        >
                          <ShieldAlert className="w-4 h-4 mr-2.5" />
                          Admin Console
                        </Link>
                        <Link
                          to="/admin/vendors"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F] transition"
                        >
                          <Store className="w-4 h-4 mr-2.5 text-slate-400" />
                          Vendor Approvals
                        </Link>
                        <Link
                          to="/admin/customers"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F] transition"
                        >
                          <Users className="w-4 h-4 mr-2.5 text-slate-400" />
                          User Database
                        </Link>
                      </div>
                    )}

                    {/* Sign out */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#1C1C1E] dark:text-[#F8F7F5] border border-[#DDD6CE] dark:border-[#3A3A40] hover:border-[#C67C4E] hover:text-[#C67C4E] transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Drawer Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label={isMenuOpen ? "Close menu" : "Open navigation menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category / Navigation Links (Desktop/Tablet) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="flex items-center space-x-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              All Products
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/vendors" className={navLinkClass}>
              Top Vendors
            </NavLink>
            <NavLink
              to="/products?sort=popular"
              className={({ isActive }) =>
                `py-1 font-semibold flex items-center gap-1 transition-colors ${
                  isActive ? "text-amber-500" : "text-slate-600 dark:text-slate-300 hover:text-amber-500"
                }`
              }
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Flash Deals</span>
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact Us
            </NavLink>
          </div>

          <div className="text-[11px] text-slate-400">
            <span>Free Express Delivery over ₹999</span>
          </div>
        </nav>
      </div>

      {/* Autocomplete Search Modal */}
      {isSearchModalOpen && (
        <SearchAutocomplete onClose={() => setIsSearchModalOpen(false)} />
      )}

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 space-y-5 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          {/* Quick Search */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchModalOpen(true);
            }}
            className="w-full flex items-center space-x-2.5 px-4 py-3 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400"
          >
            <Search className="w-4 h-4 text-[#C67C4E]" />
            <span className="flex-1 text-left">Search products, brands, or vendors...</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-700">Tap</span>
          </button>

          {/* Primary Nav Links */}
          <div className="flex flex-col space-y-1 text-xs font-bold text-slate-700 dark:text-slate-200">
            <NavLink
              to="/"
              end
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl flex items-center justify-between transition ${
                  isActive ? "bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] font-bold" : "hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F]"
                }`
              }
            >
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl flex items-center justify-between transition ${
                  isActive ? "bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] font-bold" : "hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F]"
                }`
              }
            >
              <span>Explore Products</span>
              <span className="text-[10px] text-slate-400">200+ Items</span>
            </NavLink>

            <NavLink
              to="/categories"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl flex items-center justify-between transition ${
                  isActive ? "bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] font-bold" : "hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F]"
                }`
              }
            >
              <span>Categories</span>
              <span className="text-[10px] text-slate-400">All Sectors</span>
            </NavLink>

            <NavLink
              to="/vendors"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl flex items-center justify-between transition ${
                  isActive ? "bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] font-bold" : "hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F]"
                }`
              }
            >
              <span>Verified Vendors</span>
              <span className="text-[10px] text-[#C67C4E] font-bold">Stores</span>
            </NavLink>

            <NavLink
              to="/products?sort=popular"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F] flex items-center justify-between text-[#D4A24C] dark:text-[#E5BE73] transition"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Flash Deals & Popular
              </span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full font-bold">HOT</span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl flex items-center justify-between transition ${
                  isActive ? "bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E] dark:text-[#D8956A] font-bold" : "hover:bg-[#F7F5F2] dark:hover:bg-[#2B2B2F]"
                }`
              }
            >
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#C67C4E]" />
                <span>Contact & Support</span>
              </span>
            </NavLink>

            <NavLink
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-[#F7F5F2] dark:hover:bg-[#1E1E20] flex items-center justify-between transition"
            >
              <span className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-[#C67C4E]" />
                <span>Shopping Cart</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#F8ECE3] text-[#C67C4E] dark:bg-[#2B2B2F] dark:text-[#D8956A] font-bold text-[11px]">
                {itemCount}
              </span>
            </NavLink>
          </div>

          {/* User Quick Access */}
          <div className="pt-3 border-t border-[#DDD6CE] dark:border-[#3A3A40] flex flex-col space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 bg-white dark:bg-[#1E1E20] rounded-2xl border border-[#DDD6CE] dark:border-[#3A3A40]">
                  {isAdmin ? (
                    <Shield className="w-8 h-8 p-1.5 rounded-xl bg-[#F8ECE3] dark:bg-[#2B2B2F] text-[#C67C4E]" />
                  ) : isVendor ? (
                    <Store className="w-8 h-8 p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <User className="w-8 h-8 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300" />
                  )}
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-[#1C1C1E] dark:text-[#F8F7F5] truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role} Account</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    Logout
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] font-bold text-center text-[#1C1C1E] dark:text-[#F8F7F5]"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] font-bold text-center text-[#1C1C1E] dark:text-[#F8F7F5]"
                  >
                    Profile
                  </Link>
                  {isVendor && (
                    <Link
                      to="/vendor/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="col-span-2 py-2.5 px-3 rounded-xl bg-[#F8ECE3] dark:bg-[#2B2B2F] font-bold text-center text-[#C67C4E] dark:text-[#D8956A]"
                    >
                      Vendor Storefront & Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="col-span-2 py-2.5 px-3 rounded-xl bg-[#F8ECE3] dark:bg-[#2B2B2F] font-bold text-center text-[#C67C4E] dark:text-[#D8956A]"
                    >
                      Admin Console
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#C67C4E] hover:text-[#C67C4E]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-center text-xs font-bold text-white shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import Logo from "./Logo";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Heart,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Store,
  CreditCard,
  Lock,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#1C1C1E] text-[#F8F7F5] border-t border-[#3A3A40] mt-20">
      {/* 4-Item Feature / Trust Bar */}
      <div className="border-b border-[#3A3A40] py-8 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-[#1E1E20] border border-[#3A3A40]">
            <div className="w-11 h-11 rounded-xl bg-[#C67C4E]/10 flex items-center justify-center text-[#C67C4E] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F8F7F5] uppercase tracking-wider">Express Delivery</h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Free delivery on orders over ₹999 across India</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-[#1E1E20] border border-[#3A3A40]">
            <div className="w-11 h-11 rounded-xl bg-[#C67C4E]/10 flex items-center justify-center text-[#C67C4E] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F8F7F5] uppercase tracking-wider">Buyer Protection</h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">100% verified merchants & encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-[#1E1E20] border border-[#3A3A40]">
            <div className="w-11 h-11 rounded-xl bg-[#D4A24C]/10 flex items-center justify-center text-[#D4A24C] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F8F7F5] uppercase tracking-wider">7-Day Easy Returns</h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Hassle-free doorstep returns and quick refunds</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-[#1E1E20] border border-[#3A3A40]">
            <div className="w-11 h-11 rounded-xl bg-[#C67C4E]/10 flex items-center justify-center text-[#C67C4E] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F8F7F5] uppercase tracking-wider">24/7 Dedicated Support</h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Live dispute assistance & instant seller care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Company Profile & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="sm" linkTo="/" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              VENMA is a modern multi-vendor marketplace where multiple vendors can create stores, manage products, receive orders, and grow their business while customers enjoy a seamless shopping experience.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C67C4E]" /> Subscribe to VENMA Deals
              </h5>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Receive weekly curated discounts, flash vouchers, and vendor showcases.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1E1E20] border border-[#C67C4E]/60 text-[#C67C4E] text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C67C4E] shrink-0" />
                  <span>Thank you! You are now subscribed to our VIP newsletter.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 bg-[#1E1E20] border border-[#3A3A40] text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#C67C4E] focus:ring-1 focus:ring-[#C67C4E] placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#C67C4E] hover:bg-[#A9653C] text-white rounded-xl shadow-md text-xs font-semibold flex items-center gap-1 transition shadow-sm cursor-pointer"
                    >
                      <span>Join</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                  {error && <p className="text-[11px] text-rose-400">{error}</p>}
                </form>
              )}
            </div>

            {/* Social Media Channels */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20 hover:bg-[#C67C4E] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20 hover:bg-[#C67C4E] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X Twitter"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20 hover:bg-[#C67C4E] transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20 hover:bg-[#C67C4E] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Marketplace Navigation */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Marketplace</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/products" className="hover:text-[#C67C4E] transition-colors duration-200">All Products Catalog</Link></li>
              <li><Link to="/categories" className="hover:text-[#C67C4E] transition-colors duration-200">Shop by Category</Link></li>
              <li><Link to="/vendors" className="hover:text-[#C67C4E] transition-colors duration-200">Verified Vendor Directory</Link></li>
              <li><Link to="/products?sort=popular" className="hover:text-[#C67C4E] transition-colors duration-200">Best Sellers & Trending</Link></li>
              <li><Link to="/products?featured=true" className="hover:text-[#D4A24C] transition-colors duration-200 text-[#D4A24C]">Flash Deals & Offers</Link></li>
            </ul>
          </div>

          {/* Column 3: Merchant & Partners */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Merchant Hub</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/vendor/register" className="hover:text-[#D8956A] font-semibold text-[#C67C4E] transition flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" />
                  <span>Become a Seller</span>
                </Link>
              </li>
              <li><Link to="/vendor/dashboard" className="hover:text-[#C67C4E] transition-colors duration-200">Seller Center Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-[#C67C4E] transition-colors duration-200">Merchant Sign In</Link></li>
              <li><span className="text-slate-500">Seller Guidelines & Fees</span></li>
              <li><span className="text-slate-500">Fulfillment & Logistics</span></li>
            </ul>
          </div>

          {/* Column 4: Customer Support & Contact */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Support & Office</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-[#C67C4E] transition-colors duration-200">About VENMA Platform</Link></li>
              <li><Link to="/contact" className="hover:text-[#C67C4E] transition-colors duration-200 font-medium text-[#C67C4E]">Contact Us & Support</Link></li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <a href="mailto:support@markethub.com" className="hover:text-[#C67C4E] transition-colors duration-200">support@markethub.com</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <a href="tel:+916367088841" className="hover:text-[#C67C4E] transition-colors duration-200">+91 6367088841</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C67C4E] shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#C67C4E] transition-colors duration-200 leading-snug"
                  title="View on Google Maps"
                >
                  184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India
                </a>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                Business Hours: Mon - Sat, 9am - 7pm IST
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Accounts Quick Pill */}
        <div className="mt-10 p-4 rounded-2xl bg-[#121212] border border-[#3A3A40] text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="font-bold text-slate-200">Platform Demonstration Credentials:</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-[#1E1E20] text-[#D4A24C] border border-[#3A3A40]">
                Admin: admin@markethub.com
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#1E1E20] text-[#C67C4E] border border-[#3A3A40]">
                Vendor: vendor@markethub.com
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#1E1E20] text-slate-300 border border-[#3A3A40]">
                Customer: customer@markethub.com
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#1E1E20] text-slate-400 border border-[#3A3A40]">
                Pass: password123
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Badges & Trust Footer */}
      <div className="border-t border-[#3A3A40] bg-[#121212] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <span>© {new Date().getFullYear()} VENMA Technologies Inc. All rights reserved. Buy. Sell. Grow Together.</span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#C67C4E]" /> 256-Bit SSL Encrypted
            </span>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-[#1E1E20] text-slate-300 font-mono text-[10px] font-bold border border-[#3A3A40]">
                VISA
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1E1E20] text-slate-300 font-mono text-[10px] font-bold border border-[#3A3A40]">
                MASTERCARD
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1E1E20] text-[#C67C4E] font-mono text-[10px] font-bold border border-[#3A3A40]">
                UPI
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1E1E20] text-[#D4A24C] font-mono text-[10px] font-bold border border-[#3A3A40]">
                STRIPE
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

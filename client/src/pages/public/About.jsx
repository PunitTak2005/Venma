import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Building2,
  Globe2,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { PLATFORM_CONFIG } from '../../config/platformConfig';

export default function About() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] dark:bg-[#121212] text-[#1C1C1E] dark:text-[#F8F7F5] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* 1. Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>About VENMA Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Connecting Verified Artisans & Merchants with Discerning Shoppers
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            VENMA is a modern, transparent multi-vendor ecosystem engineered to empower independent sellers, foster sustainable local enterprises, and deliver a frictionless e-commerce experience across India and beyond.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="px-6 py-3 rounded-2xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs shadow-lg shadow-[#C67C4E]/20 transition flex items-center space-x-2"
            >
              <span>Explore Marketplace Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/vendors"
              className="px-6 py-3 rounded-2xl border border-[#DDD6CE] dark:border-[#3A3A40] bg-white dark:bg-[#1E1E20] hover:bg-[#F8ECE3] dark:hover:bg-[#2B2B2F] font-bold text-xs transition flex items-center space-x-2"
            >
              <span>Browse Verified Sellers</span>
            </Link>
          </div>
        </div>

        {/* 2. Platform Key Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">100% Verified Merchants</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every seller undergoes strict identity and business validation before their catalog goes live. No unauthorized counterfeits or deceptive listings.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-[#D4A24C] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Fair Seller Ecosystem</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transparent 10% platform commission with 90% net earnings paid promptly to vendors. Fair search algorithms that showcase genuine craftsmanship.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E20] border border-[#DDD6CE] dark:border-[#3A3A40] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Doorstep Fulfillment</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Express insured courier logistics, live milestone GPS updates, and 7-day hassle-free doorstep returns guarantee peace of mind.
            </p>
          </div>
        </div>

        {/* 3. Official Headquarters & Corporate Address Section */}
        <div className="rounded-3xl overflow-hidden border border-[#DDD6CE] dark:border-[#3A3A40] bg-white dark:bg-[#1E1E20] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Address & Entity Info */}
            <div className="lg:col-span-6 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C67C4E]/10 text-[#C67C4E] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Official Headquarters</span>
                    <h2 className="text-xl sm:text-2xl font-black">{PLATFORM_CONFIG.legalEntity}</h2>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F7F5F2] dark:bg-[#121212] border border-[#DDD6CE] dark:border-[#3A3A40] space-y-3">
                  <div className="flex items-start space-x-3 text-xs">
                    <MapPin className="w-4 h-4 text-[#C67C4E] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Registered Office Address</span>
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {PLATFORM_CONFIG.address.formatted}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400">Helpline:</span>{' '}
                      <a href={`tel:${PLATFORM_CONFIG.contact.helpline}`} className="font-bold hover:text-[#C67C4E] transition">
                        {PLATFORM_CONFIG.contact.helpline}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400">Official Inquiries:</span>{' '}
                      <a href={`mailto:${PLATFORM_CONFIG.contact.supportEmail}`} className="font-bold hover:text-[#C67C4E] transition">
                        {PLATFORM_CONFIG.contact.supportEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <span className="text-slate-400">Hours:</span>{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">{PLATFORM_CONFIG.contact.businessHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <div className="pt-2">
                <a
                  href={PLATFORM_CONFIG.address.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs shadow-md transition"
                >
                  <Navigation className="w-4 h-4 text-[#C67C4E]" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Google Maps Embed Frame */}
            <div className="lg:col-span-6 min-h-[300px] sm:min-h-[380px] bg-slate-100 dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-[#DDD6CE] dark:border-[#3A3A40] relative">
              <iframe
                title="VENMA Headquarters Map"
                src={PLATFORM_CONFIG.address.embedMapUrl}
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* 4. Contact & Support Callout */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1C1C1E] via-[#242428] to-[#1C1C1E] text-white border border-[#3A3A40] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">Have Questions or Want to Partner?</h3>
            <p className="text-xs text-slate-400">
              Our support team at our Udaipur headquarters is here to assist customers and prospective merchants.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-[#C67C4E] hover:bg-[#A9653C] text-white font-bold text-xs transition shadow-md whitespace-nowrap"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}

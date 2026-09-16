import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck, HelpCircle, Navigation, ExternalLink } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 text-xs font-semibold text-[#C67C4E] bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 rounded-full border border-[#C67C4E]/30 mb-3">
            24/7 Global Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about an order, vendor onboarding, or payments? Our dedicated customer care and seller support teams are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#C67C4E]/10 dark:bg-[#C67C4E]/20 text-[#C67C4E] rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Email Us</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Reach our support agents anytime. We respond within 2-4 hours.</p>
            <a href="mailto:support@venma.com" className="text-[#C67C4E] font-semibold text-sm hover:underline">
              support@venma.com
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Toll-Free Helpline</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Direct phone support for urgent shipment or dispute resolutions.</p>
            <a href="tel:+916367088841" className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
              +91 6367088841
            </a>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Corporate Headquarters</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India
              </p>
            </div>
            <div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-semibold text-xs transition mb-2"
                title="Get Directions on Google Maps"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <span className="block text-purple-600 dark:text-purple-400 font-medium text-xs">
                Open Mon - Sat (9:00 AM - 7:00 PM IST)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send us a Message</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Fill out the details below and an account specialist will follow up.</p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mb-1">Message Received!</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto mb-4">
                  Thank you for reaching out. Ticket #VENMA-120010 has been created. We will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C67C4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C67C4E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 6367088841"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C67C4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C67C4E]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order & Tracking">Order & Tracking</option>
                      <option value="Vendor Onboarding">Vendor Onboarding / Seller Portal</option>
                      <option value="Payments & Refunds">Payments & Refunds</option>
                      <option value="Report an Issue">Report an Issue / Dispute</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Provide details about your query or order ID..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C67C4E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1C1C1E] hover:bg-[#2A2A2E] active:scale-98 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-[#1C1C1E]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-[#C67C4E]" />
                Frequently Asked
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">When will my order arrive?</p>
                  <p className="text-slate-500 dark:text-slate-400">Most verified orders dispatch within 24 hours with typical transit times of 2-5 business days across India.</p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">How can I register as a seller?</p>
                  <p className="text-slate-500 dark:text-slate-400">Click \"Become a Seller\" on the top bar or footer to submit your business details and GST credentials.</p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">What is the return policy?</p>
                  <p className="text-slate-500 dark:text-slate-400">Enjoy 7-day hassle-free doorstep returns and instant refund credits for eligible items.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1C1C1E] via-[#2A2A2E] to-[#C67C4E] rounded-2xl p-6 text-white shadow-lg border border-[#2A2A2E]">
              <ShieldCheck className="w-8 h-8 mb-3 opacity-90 text-[#D4A24C]" />
              <h4 className="font-bold text-lg mb-1">100% Buyer Protection</h4>
              <p className="text-xs text-[#EFEAE3] leading-relaxed mb-4">
                Every transaction on VENMA is protected with multi-layer SSL encryption, verified escrow payouts, and prompt resolution guarantees.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-lg w-fit">
                <Clock className="w-4 h-4 text-[#D4A24C]" /> Average resolution under 12 hrs
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Google Maps Card */}
        <div className="mt-12 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#C67C4E]/10 text-[#C67C4E] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Find Us in Udaipur, Rajasthan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">184 B Block, Sector 14, Hiran Magri, Udaipur, Rajasthan, India</p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=184+B+Block%2C+Sector+14%2C+Hiran+Magri%2C+Udaipur%2C+Rajasthan%2C+India"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#1C1C1E] hover:bg-[#2A2A2E] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition self-start sm:self-auto"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C67C4E]" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
          <div className="w-full h-72 sm:h-80 bg-slate-100 dark:bg-slate-900 relative">
            <iframe
              title="VENMA Headquarters Map"
              src="https://maps.google.com/maps?q=184+B+Block,+Sector+14,+Hiran+Magri,+Udaipur,+Rajasthan,+India&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

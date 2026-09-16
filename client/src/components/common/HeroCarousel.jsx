import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Store } from 'lucide-react';
import api from '../../services/api';

const initialSlides = [
  {
    id: 1,
    tag: 'Welcome to VENMA',
    title: 'Discover Quality.\nSupport Creators.',
    highlight: 'Creators',
    description: 'Explore live curated products across retail categories directly from verified independent stores.',
    ctaText: 'Explore Marketplace',
    ctaLink: '/products',
    secondaryText: 'Sell on VENMA',
    secondaryLink: '/vendor/register',
    badge: 'Verified Merchant Network',
    gradient: 'from-[#1C1C1E] via-[#2A2A2E] to-[#C67C4E]',
    accentColor: 'text-[#D4A24C]',
    glow: 'bg-[#C67C4E]/25',
  },
  {
    id: 2,
    tag: 'Electronics & Audio Studio',
    title: 'Precision Audio &\nSmart Peripherals.',
    description: 'Direct shipments from TechNova and Apex Gaming with 2-year manufacturer warranties and fast fulfillment.',
    ctaText: 'Shop Electronics',
    ctaLink: '/products?category=electronics',
    secondaryText: 'View TechNova Store',
    secondaryLink: '/vendors/technova-electronics',
    badge: 'Best Audio Hardware',
    gradient: 'from-[#1C1C1E] via-[#2A2A2E] to-[#8F4E24]',
    accentColor: 'text-[#C67C4E]',
    glow: 'bg-[#D4A24C]/20',
  },
  {
    id: 3,
    tag: 'Artisan Decor & Fashion',
    title: 'Timeless Style &\nNordic Aesthetics.',
    description: 'Handcrafted textiles, ceramic dinnerware, and ethical contemporary fashion from boutique makers.',
    ctaText: 'Shop Lifestyle',
    ctaLink: '/products?category=fashion-apparel',
    secondaryText: 'Explore HomeCraft',
    secondaryLink: '/vendors/homecraft-artisan-studio',
    badge: '100% Ethical Craftsmanship',
    gradient: 'from-[#2A2A2E] via-[#1C1C1E] to-[#C67C4E]',
    accentColor: 'text-[#D4A24C]',
    glow: 'bg-[#C67C4E]/30',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(initialSlides);

  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const res = await api.get('/products/count');
        if (res.data.success && res.data.count) {
          setSlides((prev) =>
            prev.map((s) =>
              s.id === 1
                ? {
                    ...s,
                    description: `Explore ${res.data.count} curated products across retail categories directly from verified independent stores.`,
                  }
                : s
            )
          );
        }
      } catch (err) {}
    };
    fetchLiveCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="container mx-auto px-4 pt-6">
      <div
        className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${slide.gradient} text-white min-h-[460px] flex items-center shadow-2xl transition-all duration-700`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C67C4E_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full ${slide.glow} blur-3xl transition-all duration-700`}></div>

        <div className="relative z-10 px-8 sm:px-14 py-12 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A24C]" />
            <span>{slide.tag}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight whitespace-pre-line text-white">
            {slide.title}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
            {slide.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link
              to={slide.ctaLink}
              className="px-7 py-3.5 rounded-2xl bg-[#1C1C1E] hover:bg-[#2A2A2E] border border-[#C67C4E]/40 text-white font-bold text-xs shadow-xl shadow-black/30 flex items-center space-x-2 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[#C67C4E]"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#C67C4E]" />
            </Link>
            <Link
              to={slide.secondaryLink}
              className="px-7 py-3.5 rounded-2xl bg-[#F7F5F2] hover:bg-white text-[#1C1C1E] font-bold text-xs shadow-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <Store className="w-4 h-4 text-[#C67C4E]" />
              <span>{slide.secondaryText}</span>
            </Link>
          </div>
        </div>

        {/* Manual Carousel Controls */}
        <div className="absolute right-6 bottom-6 flex items-center space-x-2 z-20">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex space-x-1.5 px-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  current === i ? 'w-6 bg-[#C67C4E]' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, X, Tag, Store, Package, ChevronRight, MapPin } from 'lucide-react';
import api from '../../services/api';
import InitialsBadge from './InitialsBadge';
import Tooltip from './Tooltip';

export default function SearchAutocomplete({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], vendors: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
    if (!query.trim()) {
      setResults({ products: [], vendors: [], categories: [] });
      setLoading(false);
      return;
    }

    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/public/search-suggestions?q=${encodeURIComponent(query.trim())}`);
        if (res.data?.success) {
          setResults({
            products: res.data.products || [],
            vendors: res.data.vendors || [],
            categories: res.data.categories || [],
          });
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  // Flattened suggestions for keyboard navigation (Products -> Vendors -> Categories)
  const flattenedSuggestions = [
    ...results.products.map((p) => ({ type: 'product', data: p })),
    ...results.vendors.map((v) => ({ type: 'vendor', data: v })),
    ...results.categories.map((c) => ({ type: 'category', data: c })),
  ];

  const handleSelectProduct = (p) => {
    navigate(`/products/${p.slug || p._id}`);
    onClose();
  };

  const handleSelectVendor = (v) => {
    navigate(`/vendors/${v.storeSlug || v._id}`);
    onClose();
  };

  const handleSelectCategory = (c) => {
    navigate(`/products?category=${c.slug}`);
    onClose();
  };

  const handleSelectItem = (item) => {
    if (!item) return;
    if (item.type === 'product') handleSelectProduct(item.data);
    else if (item.type === 'vendor') handleSelectVendor(item.data);
    else if (item.type === 'category') handleSelectCategory(item.data);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (flattenedSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flattenedSuggestions.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flattenedSuggestions.length - 1));
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && flattenedSuggestions[selectedIndex]) {
        handleSelectItem(flattenedSuggestions[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  const hasQuery = query.trim().length > 0;
  const hasResults =
    results.products.length > 0 || results.vendors.length > 0 || results.categories.length > 0;

  let flatCounter = 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative flex items-center bg-slate-100/80 dark:bg-slate-800/60 rounded-full border border-slate-200/80 dark:border-slate-700/60 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#C67C4E]/50 focus-within:border-[#C67C4E] transition-all">
            <Search className="w-5 h-5 text-[#C67C4E] mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, brands, or vendors..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1"
                aria-label="Clear text"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Tooltip content="Voice Search" position="bottom">
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-1.5 rounded-full transition mr-2 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                }`}
                aria-label="Voice Search"
              >
                <Mic className="w-4.5 h-4.5" />
              </button>
            </Tooltip>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Suggestions Container */}
        {hasQuery && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
            {loading && (
              <div className="flex items-center justify-center py-8 text-slate-400 font-medium space-x-2">
                <div className="w-4 h-4 border-2 border-[#C67C4E] border-t-transparent rounded-full animate-spin"></div>
                <span>Searching catalog...</span>
              </div>
            )}

            {!loading && hasResults && (
              <>
                {/* 1. Products Section */}
                {results.products.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                      Products
                    </h3>
                    <div className="space-y-1.5">
                      {results.products.map((p) => {
                        const currentIndex = flatCounter++;
                        const isSelected = currentIndex === selectedIndex;
                        return (
                          <div
                            key={p._id}
                            onClick={() => handleSelectProduct(p)}
                            tabIndex={0}
                            className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl cursor-pointer flex items-center justify-between transition group ${
                              isSelected
                                ? 'bg-[#F8ECE3] dark:bg-[#2B2B2F] border-l-4 border-[#C67C4E]'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center space-x-3.5 min-w-0">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                                alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700/60"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#C67C4E] transition truncate">
                                  {p.name}
                                </p>
                                {p.vendor?.storeName && (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                    By {p.vendor.storeName}
                                  </p>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#C67C4E] shrink-0 ml-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Vendors Section */}
                {results.vendors.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                      Vendors
                    </h3>
                    <div className="space-y-1.5">
                      {results.vendors.map((v) => {
                        const currentIndex = flatCounter++;
                        const isSelected = currentIndex === selectedIndex;
                        return (
                          <div
                            key={v._id}
                            onClick={() => handleSelectVendor(v)}
                            tabIndex={0}
                            className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl cursor-pointer flex items-center justify-between transition group ${
                              isSelected
                                ? 'bg-[#F8ECE3] dark:bg-[#2B2B2F] border-l-4 border-[#C67C4E]'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center space-x-3.5 min-w-0">
                              <InitialsBadge name={v.storeName} />
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#C67C4E] transition truncate">
                                  {v.storeName}
                                </p>
                                {(v.location || v.address?.city) && (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 text-[#C67C4E] flex-shrink-0" />
                                    <span>{v.location || `${v.address.city}, ${v.address.state}`}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#C67C4E] shrink-0 ml-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Categories Section */}
                {results.categories.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                      Categories
                    </h3>
                    <div className="space-y-1.5">
                      {results.categories.map((c) => {
                        const currentIndex = flatCounter++;
                        const isSelected = currentIndex === selectedIndex;
                        return (
                          <div
                            key={c._id}
                            onClick={() => handleSelectCategory(c)}
                            tabIndex={0}
                            className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl cursor-pointer flex items-center justify-between transition group ${
                              isSelected
                                ? 'bg-[#F8ECE3] dark:bg-[#2B2B2F] border-l-4 border-[#C67C4E]'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center space-x-3.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center shrink-0">
                                {c.image ? (
                                  <img src={c.image} alt={c.name} className="w-6 h-6 object-contain" />
                                ) : (
                                  <Tag className="w-5 h-5 text-[#C67C4E]" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#C67C4E] transition truncate">
                                  {c.name}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#C67C4E] shrink-0 ml-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {!loading && !hasResults && (
              <div className="py-10 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No matches found for "<span className="font-semibold text-slate-800 dark:text-slate-200">{query}</span>"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
                    onClose();
                  }}
                  className="mt-3 text-xs font-semibold text-[#C67C4E] hover:underline"
                >
                  Press Enter to search all products
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

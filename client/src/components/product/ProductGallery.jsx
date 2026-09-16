import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ProductGallery({ images = [], productName = 'Product' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [loadedImages, setLoadedImages] = useState({});

  const imageList = images && images.length > 0 
    ? images 
    : ['/generated-products/other/stem-modular-robotics-building-blocks-kit.webp'];

  const activeImage = imageList[selectedIndex] || imageList[0];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPosition({ x, y });
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev + 1) % imageList.length);
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, imageList.length]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* 1. Desktop Vertical Thumbnails / Mobile Horizontal */}
      {imageList.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[560px] pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 flex-shrink-0">
          {imageList.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-[#F7F5F2] dark:bg-[#1A1A1D] ${
                  isSelected
                    ? 'border-[#C87D55] ring-2 ring-[#C87D55]/30 shadow-md scale-102'
                    : 'border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100 hover:border-slate-400'
                }`}
              >
                {!loadedImages[`thumb-${idx}`] && (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                )}
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, [`thumb-${idx}`]: true }))}
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Main Hero Image Container */}
      <div className="relative flex-1 aspect-square rounded-[24px] overflow-hidden bg-[#F7F5F2] dark:bg-[#18181B] border border-[#DDD6CE]/80 dark:border-[#2C2C30] shadow-[0_12px_36px_rgba(28,28,30,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.3)] group select-none">
        {/* Skeleton shimmer before load */}
        {!loadedImages[`hero-${selectedIndex}`] && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse" />
        )}

        {/* Hero Image with Zoom Effect */}
        <div
          className="w-full h-full cursor-crosshair relative overflow-hidden"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={activeImage}
            alt={productName}
            onLoad={() => setLoadedImages((prev) => ({ ...prev, [`hero-${selectedIndex}`]: true }))}
            className={`w-full h-full object-cover object-center transition-transform duration-200 ${
              isZooming ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZooming
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Navigation Arrows for Multiple Images */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-md backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev + 1) % imageList.length);
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-md backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Lightbox Trigger Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Open fullscreen image view"
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md hover:bg-[#C87D55] hover:text-white transition-all hover:scale-105"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Image index counter badge */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider">
            {selectedIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* 3. Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center p-4 select-none animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Lightbox Controls */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
              {productName} • {selectedIndex + 1} of {imageList.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Lightbox Image View */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={productName}
              className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300"
            />

            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedIndex((prev) => (prev - 1 + imageList.length) % imageList.length)}
                  className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIndex((prev) => (prev + 1) % imageList.length)}
                  className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails inside Lightbox */}
          {imageList.length > 1 && (
            <div
              className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-xl px-4 py-2 bg-black/40 rounded-full backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedIndex === idx
                      ? 'border-[#C87D55] scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

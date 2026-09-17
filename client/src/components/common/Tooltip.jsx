import React, { useId } from 'react';

/**
 * Universal Tooltip component for VENMA Multi-Vendor Marketplace.
 * Provides a crisp, high-contrast light design (white background, slate-900 text,
 * slate-200 border, soft elevated shadow) that remains perfectly legible in both
 * light and dark mode.
 *
 * Fully WCAG-compliant with role="tooltip", aria-describedby, and keyboard focus support.
 */
export default function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
  wrapperClassName = '',
  disabled = false,
}) {
  const tooltipId = useId();

  if (!content || disabled) {
    return <>{children}</>;
  }

  // Positioning classes
  const positionStyles = {
    top: {
      tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2 translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0',
      arrow: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-white border-b-transparent border-x-transparent border-t-4 border-x-4 border-b-0',
      arrowSquare: 'top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45',
    },
    bottom: {
      tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2 -translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0',
      arrowSquare: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-white border-l border-t border-slate-200 rotate-45',
    },
    left: {
      tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2 translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0',
      arrowSquare: 'left-full top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 bg-white border-t border-r border-slate-200 rotate-45',
    },
    right: {
      tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2 -translate-x-1 group-hover:translate-x-0 group-focus-within:translate-x-0',
      arrowSquare: 'right-full top-1/2 -translate-y-1/2 -mr-1 w-2 h-2 bg-white border-b border-l border-slate-200 rotate-45',
    },
  };

  const currentPos = positionStyles[position] || positionStyles.top;

  return (
    <span className={`relative inline-flex items-center group ${wrapperClassName}`}>
      {/* Trigger element with aria-describedby for accessibility */}
      <span
        aria-describedby={tooltipId}
        className="inline-flex items-center justify-center focus:outline-none"
        tabIndex={0}
      >
        {children}
      </span>

      {/* Tooltip bubble with light, high-contrast theme-independent styling */}
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute z-50 pointer-events-none whitespace-nowrap bg-white text-slate-900 border border-slate-200 shadow-xl rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 ease-out select-none ${currentPos.tooltip} ${className}`}
      >
        {content}
        {/* Subtle arrow matching the light background */}
        <span
          aria-hidden="true"
          className={`absolute ${currentPos.arrowSquare}`}
        />
      </span>
    </span>
  );
}


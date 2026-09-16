import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export function FormField({ label, error, required, children, helperText }) {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-center text-[11px] font-medium text-red-500 mt-1">
          <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[10px] text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ label, error, required, helperText, className = "", ...props }) {
  return (
    <FormField label={label} error={error} required={required} helperText={helperText}>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-[16px] border text-xs bg-white dark:bg-[#1E1E20] text-[#1C1C1E] dark:text-[#F8F7F5] transition-all outline-none ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
            : "border-[#DDD6CE] dark:border-[#3A3A40] focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
        } ${className}`}
      />
    </FormField>
  );
}

export function PasswordInput({ label, error, required, helperText, className = "", ...props }) {
  const [show, setShow] = useState(false);

  return (
    <FormField label={label} error={error} required={required} helperText={helperText}>
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={`w-full px-3.5 py-2.5 pr-10 rounded-[16px] border text-xs bg-white dark:bg-[#1E1E20] text-[#1C1C1E] dark:text-[#F8F7F5] transition-all outline-none ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
              : "border-[#DDD6CE] dark:border-[#3A3A40] focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
          } ${className}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </FormField>
  );
}

export function SelectInput({ label, error, required, options = [], helperText, className = "", ...props }) {
  return (
    <FormField label={label} error={error} required={required} helperText={helperText}>
      <select
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-[16px] border text-xs bg-white dark:bg-[#1E1E20] text-[#1C1C1E] dark:text-[#F8F7F5] transition-all outline-none ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-[#DDD6CE] dark:border-[#3A3A40] focus:border-[#C67C4E] focus:ring-2 focus:ring-[#C67C4E]/20"
        } ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export function SubmitButton({ loading, children, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full py-3 px-4 rounded-[16px] bg-[#1C1C1E] hover:bg-[#2A2A2E] disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-black/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.98] ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}

'use client';

import React from 'react';

type InputProps = {
  label?: string;
  id?: string; // Added for accessibility
  type?: string;
  placeholder?: string;
  value?: string;
  // Merged the event types for easier usage
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  name?: string;
  options?: {
    value: string;
    label: string;
  }[];
  rows?: number;
  as?: 'input' | 'textarea' | 'select';
  disabled?: boolean;
};

export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  name,
  options = [],
  rows = 4,
  as = 'input',
  disabled = false
}: InputProps) {
  // Use the name as fallback ID if id is not provided
  const inputId = id || name;

  const baseStyles = `
    w-full px-4 py-3 rounded-lg
    bg-dark-lighter border border-grey-muted
    text-grey-pastel placeholder-grey-medium
    focus:border-primary focus:ring-1 focus:ring-primary
    transition-all duration-200 outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-grey-pastel"
        >
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          disabled={disabled}
          className={baseStyles}
        />
      ) : as === 'select' ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={baseStyles}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={baseStyles}
        />
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';

/**
 * MultiSelect Dropdown Component
 * Custom dropdown with multiple selection and checkboxes
 * Based on Figma design specifications
 */
const Dropdown = ({ 
  label, 
  options = [], 
  value = [], 
  onChange, 
  placeholder = 'Select...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleOption = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };
  
  // Display text logic
  const displayText = value.length === 0 
    ? placeholder 
    : value.length === 1 
    ? options.find(opt => opt.value === value[0])?.label 
    : `${value.length} selected`;
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center min-w-[150px]"
      >
        <span className={value.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
          {displayText}
        </span>
        <span className="text-gray-500">▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => {}}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  className = '',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 rounded-full bg-warm-brown-100/50 hover:bg-warm-brown-100 text-warm-brown-850 px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm dark:bg-warm-brown-900/40 dark:hover:bg-warm-brown-900/80 dark:text-warm-brown-200 w-full"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          size={14}
          className={`text-warm-brown-600 dark:text-warm-brown-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 min-w-[200px] w-max max-w-[280px] rounded-2xl bg-white/95 backdrop-blur-md p-1.5 shadow-xl shadow-warm-brown-900/10 border border-warm-brown-100/50 dark:bg-warm-brown-950/95 dark:border-warm-brown-850/80 transition-all duration-150 z-50">
          <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer block ${isSelected
                      ? 'bg-warm-brown-700 text-white dark:bg-warm-brown-850 dark:text-white'
                      : 'text-warm-brown-750 hover:bg-warm-brown-100/60 hover:text-warm-brown-900 dark:text-warm-brown-300 dark:hover:bg-warm-brown-900/60 dark:hover:text-warm-brown-100'
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

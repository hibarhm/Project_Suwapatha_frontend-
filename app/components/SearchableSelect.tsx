'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
    id: string;
    name: string;
    subtitle?: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder?: string;
    noResultsText?: string;
    label?: string;
    error?: string;
    loading?: boolean;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder = 'Search...',
    noResultsText = 'No results found',
    label,
    error,
    loading
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    {label}
                </label>
            )}
            <div
                onClick={() => !loading && setIsOpen(!isOpen)}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus-within:ring-2 focus-within:ring-[#94B4C1] focus-within:border-[#94B4C1] outline-none transition-all flex items-center justify-between cursor-pointer bg-white ${error ? 'border-red-500 shadow-sm shadow-red-50' : 'border-gray-200'
                    } ${loading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-[#94B4C1]'}`}
            >
                <div className="flex flex-col truncate">
                    <span className={`${selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                    {selectedOption?.subtitle && (
                        <span className="text-[10px] text-gray-400 leading-none">
                            {selectedOption.subtitle}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {loading && (
                        <div className="w-4 h-4 border-2 border-[#94B4C1]/30 border-t-[#94B4C1] rounded-full animate-spin" />
                    )}
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden transform origin-top transition-all duration-200">
                    <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <input
                                type="text"
                                autoFocus
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#94B4C1]/20 focus:border-[#94B4C1] bg-white"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#F5F8F9] transition-all flex flex-col gap-0.5 border-l-4 ${value === option.id
                                            ? 'bg-[#F0F4F6] border-[#94B4C1] text-[#94B4C1]'
                                            : 'text-gray-700 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <span className="font-medium">{option.name}</span>
                                    {option.subtitle && (
                                        <span className="text-xs text-gray-400 font-normal">{option.subtitle}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-sm text-gray-400 text-center flex flex-col items-center gap-2">
                                <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{noResultsText.replace('{searchTerm}', searchTerm)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
        </div>
    );
}

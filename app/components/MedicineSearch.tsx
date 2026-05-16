'use client';

import { useState, useEffect, useRef } from 'react';
import { medicineApi, MedicineDTO } from '@/app/api/medicine/medicineApi';

interface MedicineSearchProps {
    onSelect: (medicine: MedicineDTO) => void;
    placeholder?: string;
    className?: string;
}

export default function MedicineSearch({ onSelect, placeholder, className }: MedicineSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MedicineDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                fetchResults();
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchResults = async () => {
        setIsLoading(true);
        try {
            const data = await medicineApi.searchMedicines(query);
            setResults(data);
            setShowDropdown(true);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Medicine search failed:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    const handleSelect = (medicine: MedicineDTO) => {
        onSelect(medicine);
        setQuery(medicine.brandName !== 'N/A' ? medicine.brandName : medicine.genericName);
        setShowDropdown(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && results.length > 0 && setShowDropdown(true)}
                    placeholder={placeholder || "Search for medicine..."}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
                />
                {isLoading && (
                    <div className="absolute right-3 top-2.5">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                    </div>
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {results.map((medicine, index) => (
                        <div
                            key={index}
                            className={`px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors ${
                                index === selectedIndex ? 'bg-slate-100' : ''
                            }`}
                            onClick={() => handleSelect(medicine)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {medicine.brandName !== 'N/A' ? medicine.brandName : medicine.genericName}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {medicine.genericName !== 'N/A' && medicine.brandName !== 'N/A' ? medicine.genericName : ''}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {medicine.manufacturerName} • {medicine.dosageForm}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showDropdown && results.length === 0 && !isLoading && query.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                    <p className="text-sm text-gray-500">No medicines found</p>
                </div>
            )}
        </div>
    );
}

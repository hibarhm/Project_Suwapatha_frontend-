'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface LocationPermissionModalProps {
    onAllow: (lat: number, lng: number) => void;
    onDecline: () => void;
}

export default function LocationPermissionModal({ onAllow, onDecline }: LocationPermissionModalProps) {
    const t = useTranslations('login'); // Reusing existing translations if available, or nearbyHospitals
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const permission = localStorage.getItem('locationPermission');
        if (!permission) {
            setIsOpen(true);
        }
    }, []);

    const handleAllow = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    localStorage.setItem('userLat', latitude.toString());
                    localStorage.setItem('userLng', longitude.toString());
                    localStorage.setItem('locationPermission', 'granted');
                    onAllow(latitude, longitude);
                    setIsOpen(false);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    localStorage.setItem('locationPermission', 'denied');
                    setIsOpen(false);
                    onDecline();
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    };

    const handleDecline = () => {
        localStorage.setItem('locationPermission', 'denied');
        setIsOpen(false);
        onDecline();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-[#94B4C1]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[#94B4C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Use my location?</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Allowing location access helps find nearby hospitals and directions.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleAllow}
                            className="w-full bg-[#94B4C1] text-white py-3.5 rounded-xl font-bold hover:bg-[#7fa8b8] transition-all shadow-lg shadow-[#94B4C1]/20 active:scale-[0.98]"
                        >
                            Yes, Allow Access
                        </button>
                        <button
                            onClick={handleDecline}
                            className="w-full bg-white text-gray-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            No, Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

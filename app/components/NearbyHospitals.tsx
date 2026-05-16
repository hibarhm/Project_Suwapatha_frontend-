'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { appointmentApi } from '@/app/api/appointment/appointmentApi';
import { NearbyHospitalResponse } from '@/app/api/appointment/appointmentTypes';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const PatientIcon = L.divIcon({
    className: 'custom-patient-icon',
    html: `<div class="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const HospitalIcon = L.divIcon({
    className: 'custom-hospital-icon',
    html: `<div class="w-8 h-8 bg-[#94B4C1] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

// Component to handle map center updates
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function NearbyHospitals() {
    const t = useTranslations('nearbyHospitals');
    const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
    const [hospitals, setHospitals] = useState<NearbyHospitalResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([6.9271, 79.8612]); // Default Colombo
    const [zoom, setZoom] = useState(13);
    const [selectedHospital, setSelectedHospital] = useState<NearbyHospitalResponse | null>(null);
    const [route, setRoute] = useState<[number, number][] | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string } | null>(null);

    const fetchHospitals = useCallback(async (lat: number, lng: number) => {
        setLoading(true);
        try {
            const data = await appointmentApi.getNearbyHospitals(lat, lng);
            setHospitals(data);
            if (data.length > 0) {
                // setMapCenter([lat, lng]);
            }
        } catch (err) {
            console.error('Failed to fetch hospitals:', err);
            setError('Could not load nearby hospitals.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const lat = localStorage.getItem('userLat');
        const lng = localStorage.getItem('userLng');
        if (lat && lng) {
            const uLat = parseFloat(lat);
            const uLng = parseFloat(lng);
            setUserLoc([uLat, uLng]);
            setMapCenter([uLat, uLng]);
            fetchHospitals(uLat, uLng);
        } else {
            setLoading(false);
            setError('Location not available. Please allow location access during login.');
        }
    }, [fetchHospitals]);

    const handleFocusOnMap = (h: NearbyHospitalResponse) => {
        setMapCenter([h.latitude!, h.longitude!]);
        setZoom(15);
        setSelectedHospital(h);
        setRoute(null);
        setRouteInfo(null);
    };

    const handleViewRoute = async (h: NearbyHospitalResponse) => {
        if (!userLoc) return;
        
        setLoading(true);
        try {
            // Using OSRM public API for routing
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${userLoc[1]},${userLoc[0]};${h.longitude},${h.latitude}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            
            if (data.routes && data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
                setRoute(coordinates);
                
                const dist = (data.routes[0].distance / 1000).toFixed(1);
                const dur = Math.round(data.routes[0].duration / 60);
                setRouteInfo({
                    distance: `${dist} km`,
                    duration: `${dur} mins`
                });
                
                setSelectedHospital(h);
                // Zoom to fit both points might be better, but let's keep it simple
                setMapCenter([(userLoc[0] + h.latitude!) / 2, (userLoc[1] + h.longitude!) / 2]);
                setZoom(13);
            }
        } catch (err) {
            console.error('Routing error:', err);
            alert('Failed to calculate route.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && hospitals.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[#94B4C1] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Finding nearby hospitals...</p>
            </div>
        );
    }

    if (error && hospitals.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Location Not Found</h3>
                <p className="text-gray-500 text-sm max-w-xs">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Nearby Hospitals</h2>
                    <p className="text-sm text-gray-500">Find and navigate to the closest healthcare centers</p>
                </div>
                <button 
                    onClick={() => userLoc && fetchHospitals(userLoc[0], userLoc[1])}
                    className="p-2 text-gray-400 hover:text-[#94B4C1] transition-colors"
                    title="Refresh Location"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row h-[500px]">
                {/* Hospital List */}
                <div className="w-full lg:w-1/3 overflow-y-auto border-r border-gray-100 p-2 space-y-2">
                    {hospitals.map((h) => (
                        <div 
                            key={h.id}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                selectedHospital?.id === h.id 
                                ? 'border-[#94B4C1] bg-[#94B4C1]/5 shadow-sm' 
                                : 'border-gray-50 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedHospital(h)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-sm leading-tight pr-2">{h.name}</h3>
                                <span className="bg-[#94B4C1]/10 text-[#94B4C1] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {h.distanceKm.toFixed(1)} km
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 flex items-start gap-1">
                                <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {h.address}
                            </p>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleViewRoute(h); }}
                                    className="flex-1 py-1.5 bg-[#94B4C1] text-white text-[11px] font-bold rounded-lg hover:bg-[#7fa8b8] transition-colors"
                                >
                                    View Route
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleFocusOnMap(h); }}
                                    className="px-3 py-1.5 border border-gray-200 text-gray-600 text-[11px] font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Focus
                                </button>
                            </div>
                        </div>
                    ))}
                    {hospitals.length === 0 && (
                        <div className="py-10 text-center text-gray-400 text-sm">
                            No hospitals found nearby.
                        </div>
                    )}
                </div>

                {/* Map Container */}
                <div className="flex-1 relative">
                    <MapContainer 
                        center={mapCenter} 
                        zoom={zoom} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ChangeView center={mapCenter} zoom={zoom} />
                        
                        {/* User Location */}
                        {userLoc && (
                            <Marker position={userLoc} icon={PatientIcon}>
                                <Popup className="custom-popup">
                                    <p className="font-bold text-gray-900">Your Location</p>
                                </Popup>
                            </Marker>
                        )}

                        {/* Hospital Markers */}
                        {hospitals.map((h) => (
                            h.latitude && h.longitude && (
                                <Marker 
                                    key={h.id} 
                                    position={[h.latitude, h.longitude]} 
                                    icon={HospitalIcon}
                                    eventHandlers={{
                                        click: () => setSelectedHospital(h)
                                    }}
                                >
                                    <Popup className="custom-popup">
                                        <div className="min-w-[150px]">
                                            <p className="font-bold text-gray-900 text-sm mb-1">{h.name}</p>
                                            <p className="text-xs text-gray-500 mb-2">{h.address}</p>
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="text-[#94B4C1] font-bold">{h.distanceKm.toFixed(1)} km away</span>
                                                <button 
                                                    onClick={() => handleViewRoute(h)}
                                                    className="text-blue-600 font-bold hover:underline"
                                                >
                                                    Route
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}

                        {/* Route Polyline */}
                        {route && (
                            <Polyline 
                                positions={route} 
                                color="#3b82f6" 
                                weight={5} 
                                opacity={0.7} 
                                lineJoin="round"
                                lineCap="round"
                            />
                        )}

                        {/* Custom Map Controls */}
                        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                            <button 
                                onClick={() => setZoom(z => Math.min(z + 1, 18))}
                                className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#94B4C1] transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => setZoom(z => Math.max(z - 1, 2))}
                                className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#94B4C1] transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                            </button>
                        </div>

                        {/* Route Info Card Overlay */}
                        {routeInfo && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[280px] animate-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Estimated Travel</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-gray-900">{routeInfo.duration}</span>
                                            <span className="text-sm font-medium text-gray-400">({routeInfo.distance})</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setRoute(null); setRouteInfo(null); }}
                                        className="ml-auto p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </MapContainer>
                </div>
            </div>

            <style jsx global>{`
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    padding: 4px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .custom-popup .leaflet-popup-tip {
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .leaflet-container {
                    font-family: inherit;
                }
            `}</style>
        </div>
    );
}

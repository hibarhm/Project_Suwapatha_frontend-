'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { 
    GoogleMap, 
    useJsApiLoader, 
    Marker, 
    InfoWindow, 
    DirectionsService, 
    DirectionsRenderer,
    Polyline 
} from '@react-google-maps/api';
import { appointmentApi } from '@/app/api/appointment/appointmentApi';
import { NearbyHospitalResponse } from '@/app/api/appointment/appointmentTypes';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [{ "visibility": "on" }]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#a0a4a5" }]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#828282" }]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#f1f1f1" }]
        },
        {
            "featureType": "poi.medical",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#d8e1e5" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#e0e0e0" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#d1dee4" }]
        }
    ]
};

export default function NearbyHospitals() {
    const t = useTranslations('nearbyHospitals');
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);
    const [hospitals, setHospitals] = useState<NearbyHospitalResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>({ lat: 6.9271, lng: 79.8612 }); // Default Colombo
    const [zoom, setZoom] = useState(13);
    const [selectedHospital, setSelectedHospital] = useState<NearbyHospitalResponse | null>(null);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string } | null>(null);
    const [isRouting, setIsRouting] = useState(false);
    const [fallbackRoute, setFallbackRoute] = useState<google.maps.LatLngLiteral[] | null>(null);

    const fetchHospitals = useCallback(async (lat: number, lng: number) => {
        setLoading(true);
        try {
            const data = await appointmentApi.getNearbyHospitals(lat, lng);
            // Sort by distance just in case backend doesn't
            const sortedHospitals = [...data].sort((a, b) => a.distanceKm - b.distanceKm);
            setHospitals(sortedHospitals);
            
            // Automatically select and route to the nearest hospital
            if (sortedHospitals.length > 0) {
                const nearest = sortedHospitals[0];
                setSelectedHospital(nearest);
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
            setUserLoc({ lat: uLat, lng: uLng });
            setMapCenter({ lat: uLat, lng: uLng });
            fetchHospitals(uLat, uLng);
        } else {
            setLoading(false);
            setError('Location not available. Please allow location access during login.');
        }
    }, [fetchHospitals]);

    const handleFocusOnMap = (h: NearbyHospitalResponse) => {
        if (!h.latitude || !h.longitude) return;
        setMapCenter({ lat: h.latitude, lng: h.longitude });
        setZoom(15);
        setSelectedHospital(h);
        setDirectionsResponse(null);
        setRouteInfo(null);
    };

    const handleViewRoute = (h: NearbyHospitalResponse) => {
        if (!userLoc || !h.latitude || !h.longitude) return;
        
        // 1. Open Google Maps in a new tab for turn-by-turn navigation
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${h.latitude},${h.longitude}&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');

        // 2. Also show the preview on the internal map
        setIsRouting(true);
        setDirectionsResponse(null);
        setRouteInfo(null);
        setFallbackRoute(null);
        setSelectedHospital(h);
        setMapCenter({ lat: (userLoc.lat + h.latitude) / 2, lng: (userLoc.lng + h.longitude) / 2 });
        setZoom(13);
    };

    const directionsCallback = useCallback(async (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (result !== null && status === 'OK') {
            setIsRouting(false);
            setDirectionsResponse(result);
            const route = result.routes[0].legs[0];
            setRouteInfo({
                distance: route.distance?.text || '',
                duration: route.duration?.text || ''
            });
        } else if (status === 'REQUEST_DENIED' || status === 'ZERO_RESULTS') {
            console.warn("Google Directions failed or denied, using OSRM fallback...");
            if (!userLoc || !selectedHospital) return;
            
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${userLoc.lng},${userLoc.lat};${selectedHospital.longitude},${selectedHospital.latitude}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                
                if (data.routes && data.routes[0]) {
                    const route = data.routes[0];
                    setRouteInfo({
                        distance: `${(route.distance / 1000).toFixed(1)} km`,
                        duration: `${Math.round(route.duration / 60)} mins`
                    });
                    
                    // Map OSRM coordinates to Google LatLng
                    const coords = route.geometry.coordinates.map((coord: [number, number]) => ({
                        lat: coord[1],
                        lng: coord[0]
                    }));
                    setFallbackRoute(coords);
                } else {
                    alert("Could not find a driving route even with fallback.");
                }
            } catch (error) {
                console.error("OSRM Fallback failed:", error);
            } finally {
                setIsRouting(false);
            }
        } else {
            console.error(`Directions request failed: ${status}`);
            setIsRouting(false);
        }
    }, [userLoc, selectedHospital]);

    const directionsServiceOptions = useMemo(() => {
        if (!userLoc || !selectedHospital || !selectedHospital.latitude || !selectedHospital.longitude) return null;
        return {
            origin: userLoc,
            destination: { lat: selectedHospital.latitude, lng: selectedHospital.longitude },
            travelMode: 'DRIVING' as google.maps.TravelMode
        };
    }, [userLoc, selectedHospital]);

    if (!isLoaded || (loading && hospitals.length === 0)) {
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
                    onClick={() => userLoc && fetchHospitals(userLoc.lat, userLoc.lng)}
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
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter}
                        zoom={zoom}
                        options={mapOptions}
                    >
                        {/* User Location */}
                        {userLoc && (
                            <Marker 
                                position={userLoc}
                                icon={{
                                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                    scaledSize: new google.maps.Size(40, 40)
                                }}
                            />
                        )}

                        {/* Hospital Markers */}
                        {hospitals.map((h) => (
                            h.latitude && h.longitude && (
                                <Marker 
                                    key={h.id} 
                                    position={{ lat: h.latitude, lng: h.longitude }}
                                    onClick={() => setSelectedHospital(h)}
                                    icon={{
                                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                        scaledSize: new google.maps.Size(32, 32)
                                    }}
                                />
                            )
                        ))}

                        {/* Directions */}
                        {directionsServiceOptions && !directionsResponse && (
                            <DirectionsService
                                key={`${selectedHospital?.id}-${userLoc?.lat}-${userLoc?.lng}`}
                                options={directionsServiceOptions}
                                callback={directionsCallback}
                            />
                        )}

                        {/* Fallback Route Polyline (if Google Directions fails) */}
                        {fallbackRoute && !directionsResponse && (
                            <Polyline
                                path={fallbackRoute}
                                options={{
                                    strokeColor: '#3B82F6',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 5,
                                }}
                            />
                        )}

                        {directionsResponse && (
                            <DirectionsRenderer
                                options={{
                                    directions: directionsResponse,
                                    suppressMarkers: true,
                                    polylineOptions: {
                                        strokeColor: '#3b82f6',
                                        strokeWeight: 5,
                                        strokeOpacity: 0.7
                                    }
                                }}
                            />
                        )}

                        {/* Info Window for Selected Hospital */}
                        {selectedHospital && selectedHospital.latitude && selectedHospital.longitude && (
                            <InfoWindow
                                position={{ lat: selectedHospital.latitude, lng: selectedHospital.longitude }}
                                onCloseClick={() => setSelectedHospital(null)}
                            >
                                <div className="min-w-[150px] p-1">
                                    <p className="font-bold text-gray-900 text-sm mb-1">{selectedHospital.name}</p>
                                    <p className="text-xs text-gray-500 mb-2">{selectedHospital.address}</p>
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-[#94B4C1] font-bold">{selectedHospital.distanceKm.toFixed(1)} km away</span>
                                    </div>
                                </div>
                            </InfoWindow>
                        )}

                        {/* Custom Map Controls */}
                        <div className="absolute top-4 right-4 z-[10] flex flex-col gap-2">
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
                        {(routeInfo || isRouting) && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[280px] animate-in slide-in-from-bottom-4">
                                {isRouting ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-[#94B4C1] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-sm font-medium text-gray-600">Calculating route...</p>
                                    </div>
                                ) : routeInfo && (
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
                                            onClick={() => { setDirectionsResponse(null); setRouteInfo(null); }}
                                            className="ml-auto p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
}

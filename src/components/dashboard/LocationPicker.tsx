"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Dynamically import map with no SSR
const LocationMap = dynamic(() => import("./LocationMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    )
});

export default function LocationPicker() {
    const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [addressQuery, setAddressQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Initial position (if editing) or default could be passed as props. 
    // For now we start empty or default.

    const handleLocationSelect = useCallback((lat: number, lng: number) => {
        setPosition({ lat, lng });
    }, []);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition({ lat: latitude, lng: longitude });
                setIsLoadingLocation(false);
                toast.success("Location found!");
            },
            (err) => {
                console.error(err);
                toast.error("Unable to retrieve your location");
                setIsLoadingLocation(false);
            }
        );
    };

    const searchAddress = async () => {
        if (!addressQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
                toast.success("Address found!");
            } else {
                toast.error("Address not found");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error searching address");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Hidden Inputs for Form Submission */}
            <input type="hidden" name="latitude" value={position?.lat || ""} />
            <input type="hidden" name="longitude" value={position?.lng || ""} />

            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={addressQuery}
                        onChange={(e) => setAddressQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchAddress())}
                        placeholder="Search area (e.g. MG Road, Bangalore)"
                        className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    />
                    <button
                        type="button"
                        onClick={searchAddress}
                        disabled={isSearching}
                        className="absolute right-2 top-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-emerald-200 text-emerald-700 font-medium rounded-xl hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                >
                    {isLoadingLocation ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Navigation className="w-5 h-5" />
                    )}
                    Use Current Location
                </button>
            </div>

            <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50 relative">
                {position ? (
                    <LocationMap
                        latitude={position.lat}
                        longitude={position.lng}
                        onLocationSelect={handleLocationSelect}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                        <MapPin className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-sm font-medium">Search for an address or use your current location to pin the medicine's location on the map.</p>
                    </div>
                )}
            </div>
            {/* Helper text */}
            {position && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Drag the marker to pinpoint the exact location.
                </p>
            )}
        </div>
    );
}

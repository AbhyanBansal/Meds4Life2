"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";

interface Listing {
    id: string;
    title: string;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    images: string[] | null;
}

interface ListingsMapProps {
    listings: Listing[];
}

function MapController({ listings }: { listings: Listing[] }) {
    const map = useMap();

    useEffect(() => {
        if (listings.length === 0) return;

        // Create bounds from all listings
        const bounds = L.latLngBounds(listings.map(l => [l.latitude!, l.longitude!]));

        // Fit map to bounds with some padding
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [listings, map]);

    return null;
}

export default function ListingsMap({ listings }: ListingsMapProps) {
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India default

    // Filter valid listings just in case
    const validListings = listings.filter(l => l.latitude && l.longitude);

    if (validListings.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4">
                <div className="bg-emerald-100 p-4 rounded-full">
                    <Package className="w-8 h-8 text-emerald-600" />
                </div>
                <p>No medicines found with location data.</p>
            </div>
        );
    }

    return (
        <MapContainer
            center={defaultCenter}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController listings={validListings} />

            {validListings.map((listing) => (
                <Marker
                    key={listing.id}
                    position={[listing.latitude!, listing.longitude!]}
                >
                    <Popup className="listing-popup">
                        <div className="p-1 min-w-[200px]">
                            <h3 className="font-semibold text-base mb-1">{listing.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {listing.description || "No description provided."}
                            </p>
                            <Link
                                href={`/dashboard/listings/${listing.id}`}
                                className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                                View Details
                                <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

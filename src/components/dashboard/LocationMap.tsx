"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";

interface LocationMapProps {
    latitude: number;
    longitude: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onLocationSelect }: { position: { lat: number, lng: number }, onLocationSelect: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
        dragend() {
            // Handle map drag end if needed, but we rely on click or marker drag
        }
    });

    // Update map view if position changes externally (e.g. via address search)
    useEffect(() => {
        map.flyTo(position, map.getZoom());
    }, [position, map]);

    const eventHandlers = {
        dragend(e: L.DragEndEvent) {
            const marker = e.target;
            const position = marker.getLatLng();
            onLocationSelect(position.lat, position.lng);
        },
    };

    return position === null ? null : (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={eventHandlers}
        >
            <Popup>Location selected</Popup>
        </Marker>
    );
}

export default function LocationMap({ latitude, longitude, onLocationSelect }: LocationMapProps) {
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Fallback to India center or user's preference
    const center = (latitude && longitude) ? { lat: latitude, lng: longitude } : defaultCenter;

    useEffect(() => {
        // Fix Leaflet's default icon path issues with Next.js/Turbopack
        if (typeof window !== 'undefined') {
            delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        }
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={center} onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
}

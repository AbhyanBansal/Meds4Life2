"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Searchbar from "@/components/dashboard/locate/Searchbar";
import { searchListings } from "./actions";
import { Pill, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

// Dynamic import for Map to avoid SSR issues with Leaflet
const ListingsMap = dynamic(
    () => import("@/components/dashboard/ListingsMap"),
    {
        loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>,
        ssr: false
    }
);

interface Listing {
    id: string;
    title: string;
    description: string | null;
    status: "AVAILABLE" | "RESERVED" | "COLLECTED" | "EXPIRED" | null;
    latitude: number | null;
    longitude: number | null;
    images: string[] | null;
    quantity: string | null;
    expiryDate: Date | null;
    packagingType: string | null;
    ownerName: string | null;
    ownerAvatar: string | null;
}

export default function LocatePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Optimize: Wrap in useCallback to prevent infinite loop with Searchbar's useEffect
    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setListings([]);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        try {
            const results = await searchListings(query);
            // Ensure dates are parsed back to Date objects if JSON serialization messed them up
            const parsedResults = results.map(r => ({
                ...r,
                expiryDate: r.expiryDate ? new Date(r.expiryDate) : null
            }));
            setListings(parsedResults);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="flex min-h-[calc(100dvh-10rem)] flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                    Locate Medicines
                </h1>
                <p className="text-gray-600">Find medicines available near you.</p>
            </div>

            <div className="w-full max-w-2xl">
                <Searchbar onSearch={handleSearch} className="w-full" isLoading={isLoading} />
            </div>

            <div className="grid flex-1 min-h-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
                {/* Results List - Scrollable */}
                <div className="relative flex flex-col gap-4 pb-2 pr-2 lg:max-h-[calc(100dvh-15rem)] lg:overflow-y-auto">
                    {/* Show loader only if we have NO listings, or overlay if we do */}
                    {isLoading && listings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                            <p>Searching for medicines...</p>
                        </div>
                    ) : listings.length > 0 ? (
                        <div className={`flex flex-col gap-4 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                            {listings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex gap-4">
                                        {/* Image Section */}
                                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                                            {listing.images && listing.images.length > 0 ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Pill className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 text-lg truncate">{listing.title}</h3>

                                            <div className="flex flex-wrap gap-y-1 gap-x-3 mt-1 mb-2 text-xs text-gray-500">
                                                {listing.quantity && (
                                                    <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                                                        Qty: {listing.quantity}
                                                    </span>
                                                )}
                                                {listing.packagingType && (
                                                    <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                                                        {listing.packagingType}
                                                    </span>
                                                )}
                                                {listing.status && (
                                                    <span
                                                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                                                            listing.status === "RESERVED"
                                                                ? "bg-blue-50 text-blue-600"
                                                                : "bg-emerald-50 text-emerald-600"
                                                        }`}
                                                    >
                                                        {listing.status}
                                                    </span>
                                                )}
                                                {listing.expiryDate && (
                                                    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${new Date(listing.expiryDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        Exp: {new Date(listing.expiryDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                                {listing.description || "No description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                                        <div className="flex items-center gap-2">
                                            {listing.ownerAvatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={listing.ownerAvatar} alt="" className="w-5 h-5 rounded-full" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
                                                    {listing.ownerName?.[0]?.toUpperCase() || "U"}
                                                </div>
                                            )}
                                            <span className="text-xs text-gray-500 truncate max-w-[120px]">{listing.ownerName}</span>
                                        </div>

                                        <Link
                                            href={`/dashboard/listings/${listing.id}`}
                                            className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm shadow-emerald-200"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : hasSearched ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Pill className="w-12 h-12 text-gray-300 mb-2" />
                            <p className="font-medium">No medicines found</p>
                            <p className="text-sm">Try searching for a different name.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <SearchbarIcon className="w-12 h-12 text-gray-300 mb-2" />
                            <p>Enter a medicine name to search</p>
                        </div>
                    )}
                </div>

                {/* Map View */}
                <div className="min-h-[320px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm lg:min-h-0">
                    <ListingsMap listings={listings} />
                </div>
            </div>
        </div>
    );
}

function SearchbarIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

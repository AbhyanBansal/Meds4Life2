"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Searchbar({
    className,
    onSearch,
    isLoading = false
}: {
    className?: string,
    onSearch?: (query: string) => void,
    isLoading?: boolean
}) {
    const [query, setQuery] = useState("");

    // Simple debounce implementation inside component to avoid dependency on missing lib
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onSearch) {
                onSearch(query);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-emerald-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition duration-150 ease-in-out shadow-sm hover:shadow-md"
                placeholder="Search medicines by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                </div>
            )}
        </div>
    );
}

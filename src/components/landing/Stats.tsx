import React from 'react';

export default function Stats() {
    return (
        <div className="mt-20 glass-card rounded-3xl p-8 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div>
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">100%</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wide text-xs">Non-Commercial</p>
            </div>
            <div className="relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-200 hidden md:block"></div>
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">Zero</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wide text-xs">Medicine Waste</p>
            </div>
            <div className="relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-200 hidden md:block"></div>
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">Verified</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wide text-xs">Expiry Checks</p>
            </div>
            <div className="relative">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-200 hidden md:block"></div>
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">Local</p>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wide text-xs">Community Based</p>
            </div>
        </div>
    );
}

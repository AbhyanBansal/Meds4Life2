import React from 'react';
import { Search, UploadCloud } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-36 pb-20 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-emerald-800 text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Community-Driven Health Network
                </div>

                <h1 className="text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                    Responsible sharing for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 animate-gradient">accessible healthcare.</span>
                </h1>

                <p className="text-xl text-gray-600/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Connect with neighbors to donate unused medicines or find what you need nearby. A secure, location-based PWA reducing waste.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl text-base font-medium transition-all shadow-xl shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2 border border-emerald-500 cursor-pointer">
                        <Search className="w-5 h-5" />
                        Find Medicines
                    </button>
                    <button className="w-full sm:w-auto glass-card text-gray-900 hover:bg-white/60 px-8 py-4 rounded-2xl text-base font-medium transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <UploadCloud className="w-5 h-5 text-emerald-600" />
                        Donate Surplus
                    </button>
                </div>
            </div>
        </section>
    );
}

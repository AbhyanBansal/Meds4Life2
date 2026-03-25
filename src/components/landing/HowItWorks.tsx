import React from 'react';
import { User, Bell, Search, Pill, Check } from 'lucide-react';

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-16 sm:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200/40 to-teal-200/40 blur-[60px] rounded-full transform scale-90"></div>

                        <div className="relative glass-card rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 max-w-md mx-auto lg:mx-0 shadow-2xl shadow-emerald-900/5">
                            <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                                        <User className="w-5 h-5 text-emerald-700" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="h-2.5 w-24 bg-gray-200/80 rounded-full mb-2"></div>
                                        <div className="h-2 w-16 bg-gray-100/80 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="p-2.5 bg-white/50 rounded-xl border border-white shadow-sm backdrop-blur-sm">
                                    <Bell className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="bg-white/70 p-4 rounded-2xl border border-white/60 mb-8 flex items-center gap-3 shadow-sm backdrop-blur-sm">
                                <Search className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-400 text-sm font-medium">Search medicines...</span>
                            </div>

                            <div className="bg-white/80 p-4 rounded-2xl border border-white shadow-sm mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group cursor-pointer hover:bg-white transition-colors">
                                <div className="flex gap-4 min-w-0">
                                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100 shrink-0">
                                        <Pill className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm">Amoxicillin 500mg</p>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">Exp: 12/2025 - 0.5km away</p>
                                    </div>
                                </div>
                                <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-xs font-semibold group-hover:bg-emerald-100 transition-colors w-full sm:w-auto">
                                    Request
                                </button>
                            </div>

                            <div className="bg-white/40 p-4 rounded-2xl border border-white/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-70">
                                <div className="flex gap-4 min-w-0">
                                    <div className="w-12 h-12 bg-blue-50/50 rounded-xl flex items-center justify-center text-blue-600/70 border border-blue-100/50 shrink-0">
                                        <Pill className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm">Paracetamol</p>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">Exp: 08/2026 - 1.2km away</p>
                                    </div>
                                </div>
                                <button className="bg-gray-50/50 text-gray-400 px-4 py-2 rounded-lg text-xs font-semibold w-full sm:w-auto">
                                    Request
                                </button>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:absolute sm:-right-6 sm:top-1/2 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 animate-[bounce_3s_infinite]">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-2 rounded-full border border-green-100">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Request Approved</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Pick up today at 5 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-block text-emerald-600 font-semibold tracking-wide text-xs mb-4 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            How it Works
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-6">
                            Designed for simplicity.
                            <br className="hidden sm:block" />
                            Built for speed.
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                            MediShare operates as a Progressive Web App, meaning you can install it directly from your browser without visiting an app store.
                        </p>

                        <div className="space-y-8 sm:space-y-10">
                            <div className="flex gap-5">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm relative z-10">
                                    1
                                </div>
                                <div className="pt-1">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">List your surplus</h4>
                                    <p className="text-base text-gray-500">Enter medicine name, expiry date, and quantity. Our system validates the details automatically.</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm relative z-10">
                                    2
                                </div>
                                <div className="pt-1">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Discover nearby</h4>
                                    <p className="text-base text-gray-500">Search for what you need. Results are filtered by distance to ensure quick access.</p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm relative z-10">
                                    3
                                </div>
                                <div className="pt-1">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Connect & Collect</h4>
                                    <p className="text-base text-gray-500">Securely chat to arrange a pickup. Safe, contactless, and completely free.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

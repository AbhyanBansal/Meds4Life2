import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-20 sm:py-32 relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="glass-card rounded-[2.25rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden">
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-emerald-50/30 to-emerald-100/30 pointer-events-none"></div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-6 relative">Start sharing healing today.</h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto relative">Join the community dedicated to reducing waste and improving health access with a mobile-friendly sign-up flow.</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                        <Link href="/register" className="w-full sm:w-auto">
                            <span className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl text-base sm:text-lg font-medium transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer">
                                Create Account
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <span className="w-full sm:w-auto bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 px-8 py-4 rounded-2xl text-base sm:text-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer">
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

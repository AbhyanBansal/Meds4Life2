import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/60 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                        <Plus className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-base font-semibold text-gray-900">MediShare</span>
                </div>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-gray-500">
                    <Link href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-emerald-600 transition-colors">Safety Guidelines</Link>
                </div>

                <div className="text-sm text-gray-400 font-medium">
                    (c) 2026 MediShare Platform.
                </div>
            </div>
        </footer>
    );
}

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getSession } from "@/lib/auth";

export default async function Navbar() {
    const session = await getSession();

    return (
        <nav className="fixed w-full z-50 glass-panel border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
                <Link href="/" className="flex items-center gap-2 group min-w-0">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-2 rounded-xl border border-emerald-100/50 shadow-sm group-hover:shadow-emerald-100/50 transition-all shrink-0">
                        <Plus className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 truncate">MediShare</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">How it Works</Link>
                    <Link href="#safety" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">Safety</Link>
                    <Link href="#mission" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">Mission</Link>
                </div>

                <div className="flex items-center gap-2">
                    {!session ? (
                        <Link
                            href="/login"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-gray-200 hover:shadow-gray-300"
                        >
                            Sign In
                        </Link>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-gray-200 hover:shadow-gray-300"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

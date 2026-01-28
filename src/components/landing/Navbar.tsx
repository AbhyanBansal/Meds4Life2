import React from 'react';
import Link from 'next/link';
import { Plus, Smartphone } from 'lucide-react';
import { getSession } from "@/lib/auth";

export default async function Navbar() {
    const session = await getSession();

    return (
        <nav className="fixed w-full z-50 glass-panel border-b border-white/20">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-2 rounded-xl border border-emerald-100/50 shadow-sm group-hover:shadow-emerald-100/50 transition-all">
                        <Plus className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-gray-900">MediShare</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">How it Works</Link>
                    <Link href="#safety" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">Safety</Link>
                    <Link href="#mission" className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">Mission</Link>
                </div>

                <div className="flex items-center gap-4">
                    {!session ? (
                        <Link href="/login">
                            <button className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</button>
                        </Link>
                    ) : (
                        <Link href="/dashboard">
                            <button className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</button>
                        </Link>
                    )}

                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-gray-200 hover:shadow-gray-300 flex items-center gap-2 cursor-pointer">
                        <span>Install App</span>
                        <Smartphone className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>
        </nav>
    );
}

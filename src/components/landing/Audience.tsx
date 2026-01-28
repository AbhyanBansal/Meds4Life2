import React from 'react';
import { Home, GraduationCap, HeartHandshake } from 'lucide-react';

export default function Audience() {
    return (
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
            {/* Dark colored glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-900/20 rounded-full blur-[120px]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Who is MediShare for?</h2>
                    <p className="text-xl text-gray-400">Building a healthier community for everyone.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 p-8 rounded-3xl hover:bg-gray-800/60 transition-colors">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mb-6">
                            <Home className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Households</h3>
                        <p className="text-lg text-gray-400 leading-relaxed">Individuals with recovered patients or surplus medication looking to clear space responsibly.</p>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 p-8 rounded-3xl hover:bg-gray-800/60 transition-colors">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mb-6">
                            <GraduationCap className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Students & Seniors</h3>
                        <p className="text-lg text-gray-400 leading-relaxed">Groups often on tight budgets who require access to common, essential medicines.</p>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 p-8 rounded-3xl hover:bg-gray-800/60 transition-colors">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mb-6">
                            <HeartHandshake className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Emergency Seekers</h3>
                        <p className="text-lg text-gray-400 leading-relaxed">People needing immediate, short-term medication when pharmacies are closed.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

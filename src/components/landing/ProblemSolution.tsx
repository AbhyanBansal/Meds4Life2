import React from 'react';
import { Trash2, MapPin, ShieldCheck } from 'lucide-react';

export default function ProblemSolution() {
    return (
        <section className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">Bridging the gap between<br />surplus and scarcity.</h2>
                    <p className="text-xl text-gray-500 max-w-2xl">Large quantities of usable medicine are discarded daily while many struggle to access essential care.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="glass-card p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-rose-100">
                            <Trash2 className="w-6 h-6 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">Reduce Waste</h3>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Redirect valid, unexpired medicines from landfills to medicine cabinets where they are needed most.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-card p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-300/20 transition-colors"></div>
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">Hyper-Local Access</h3>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Find essential medicines within your neighborhood. A location-first approach ensures help is always nearby.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-card p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">Safety Protocol</h3>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Built-in expiry validation and community reporting tools ensure only safe, usable medicines are exchanged.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

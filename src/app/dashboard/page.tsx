import { ArrowUpRight, Pill, GitPullRequest, Archive } from "lucide-react";

export default function Dashboard() {
    return (
        <div>
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back to your community health dashboard.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Stat 1 */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Listings</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                            <Pill className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                            <GitPullRequest className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Donated</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">45</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                            <Archive className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="glass-card rounded-2xl border border-white/60 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</button>
                </div>

                <div className="space-y-4">
                    {/* Activity Item 1 */}
                    <div className="flex items-center justify-between bg-white/40 p-4 rounded-xl border border-white/60">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">
                                AS
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Alex Smith requested <span className="font-bold">Amoxicillin</span></p>
                                <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                            </div>
                        </div>
                        <button className="text-xs font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-700">Review</button>
                    </div>
                    {/* Activity Item 2 */}
                    <div className="flex items-center justify-between bg-white/40 p-4 rounded-xl border border-white/60">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">You listed <span className="font-bold">Ibuprofen 400mg</span></p>
                                <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
                            </div>
                        </div>
                        <div className="text-xs font-medium text-gray-500">
                            Listed
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

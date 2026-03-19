"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pill, GitPullRequest, UserCircle, Plus, MapPin, LogOut, Shield } from "lucide-react";
import UserAvatar from "./UserAvatar";

interface User {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    role?: "ORG_ADMIN" | "MEMBER" | "SUPER_ADMIN" | null;
}

const baseNavigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Locate", href: "/dashboard/locate", icon: MapPin, mobileOnly: true },
    { name: "New", href: "/dashboard/listings/new", icon: Plus, mobileOnly: true },
    { name: "Listings", href: "/dashboard/listings", icon: Pill },
    { name: "Requests", href: "/dashboard/requests", icon: GitPullRequest },
    { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export default function Sidebar({ user }: { user?: User | null }) {
    const pathname = usePathname();

    const navigation = [...baseNavigation];
    if (user?.role === 'ORG_ADMIN') {
        navigation.push({ name: "Admin", href: "/dashboard/admin", icon: Shield });
    }
    if (user?.role === 'SUPER_ADMIN') {
        navigation.push({ name: "Super Admin", href: "/dashboard/super-admin", icon: Shield });
    }

    return (
        <>
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <div className="hidden md:flex h-full border-r border-white/20 glass-panel flex-col w-64 fixed left-0 top-0 pt-6 pb-4 z-50">
                {/* Branding Header */}
                <div className="px-6 mb-6 flex items-center gap-2">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-2 rounded-xl border border-emerald-100/50 shadow-sm">
                        <Plus className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-gray-900">MediShare</span>
                </div>

                <div className="px-6 mb-8 mt-4 flex flex-col gap-4">
                    <Link href="/dashboard/listings/new">
                        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium shadow-lg shadow-emerald-200 transition-all active:scale-95">
                            <Plus className="w-5 h-5" />
                            <span>New Listing</span>
                        </button>
                    </Link>

                    <Link href="/dashboard/locate">
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-200 transition-all active:scale-95">
                            <MapPin className="w-5 h-5" />
                            <span>Locate Meds</span>
                        </button>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navigation.filter(item => !item.mobileOnly).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                    ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100 translate-x-1"
                                    : "text-gray-600 hover:bg-white/40 hover:text-gray-900 hover:translate-x-1"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                                {item.name === "Listings" ? "My Listings" : item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    {user && (
                        <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-white/50 border border-white/40 shadow-sm">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold border border-emerald-200 overflow-hidden">
                                <UserAvatar user={user} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name || "User"}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <form action="/logout" method="GET">
                        <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/40 border border-white/40 shadow-sm backdrop-blur-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all group">
                            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Sign Out</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Mobile Header (Fixed Top) */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-emerald-100 bg-white/80 px-4 pb-3 pt-[calc(0.75rem+var(--safe-top))] shadow-sm backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-1.5 rounded-lg border border-emerald-100/50">
                        <Plus className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-gray-900">MediShare</span>
                </div>
                <Link href="/dashboard/profile">
                    <div className="p-2 bg-gray-100 rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
                        <UserAvatar user={user || null} />
                    </div>
                </Link>
            </div>

            {/* Mobile Bottom Navigation (Fixed Bottom) */}
            <div className="md:hidden fixed left-4 right-4 z-50 bottom-[calc(1rem+var(--safe-bottom))]">
                <div className="border border-emerald-500 shadow-xl shadow-emerald-900/20 rounded-2xl p-2 bg-emerald-600 backdrop-blur-xl">
                    <div className="grid grid-cols-6 gap-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-200 ${isActive
                                        ? "text-emerald-600 bg-white shadow-sm"
                                        : "text-emerald-100 hover:bg-emerald-500 hover:text-white"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? "fill-emerald-100" : ""}`} strokeWidth={2} />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

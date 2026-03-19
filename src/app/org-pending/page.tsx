'use client';
import { LogOut, Building, Clock } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logoutAction, checkApprovalStatus } from "../actions";

export default function OrgPendingPage() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(async () => {
            const status = await checkApprovalStatus();
            if (status === 'APPROVED') {
                router.refresh(); // Update server components/middleware check
                router.push('/dashboard');
            }
            if (status === 'REJECTED') {
                router.replace('/login?error=organization_rejected');
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-6">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md animate-pulse">
                    <Building className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Review</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Your organization is currently under review by the Super Administrator.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-left flex gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                        You will not be able to access the dashboard until your organization is <span className="font-semibold">Approved</span>.
                    </p>
                </div>

                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}

'use client';
import { LogOut, Clock, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logoutAction, checkUserApprovalStatus } from "../actions";

export default function ApprovalPendingPage() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(async () => {
            const status = await checkUserApprovalStatus();
            if (status === 'APPROVED') {
                router.refresh(); // Update server components/middleware check
                router.push('/dashboard');
            }
            if (status === 'REJECTED') {
                router.replace('/login?error=account_rejected');
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-6">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md animate-pulse">
                    <Clock className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Approval Pending</h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Your account has been created and is currently waiting for approval from your organization administrator.
                </p>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-left flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                        You will not be able to access the dashboard until your account status is updated to <span className="font-semibold">Approved</span>.
                    </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-8 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-emerald-700 font-medium">
                        Auto-checking approval status...
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

import Link from "next/link";
import { RefreshCcw, WifiOff } from "lucide-react";

export default function OfflinePage() {
    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-8">
            <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-xl backdrop-blur-xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <WifiOff className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">You&apos;re Offline</h1>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                    MediShare could not reach the network just now. Reconnect to continue syncing listings,
                    requests, and approvals.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-500"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </Link>
                    <p className="text-xs text-gray-500">
                        Cached pages remain available, but live dashboard updates need a connection.
                    </p>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, Check, Clock, Package, User, X } from "lucide-react";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { listings, requests } from "@/db/schema";
import { getSession } from "@/lib/auth";

import {
    approveIncomingRequest,
    completeIncomingRequest,
    rejectIncomingRequest,
} from "./actions";

function getStatusClasses(status: string | null) {
    if (status === "PENDING") {
        return "bg-amber-50 text-amber-600";
    }

    if (status === "APPROVED") {
        return "bg-emerald-50 text-emerald-600";
    }

    if (status === "COMPLETED") {
        return "bg-blue-50 text-blue-600";
    }

    return "bg-red-50 text-red-600";
}

export default async function RequestsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const sentRequests = await db.query.requests.findMany({
        where: eq(requests.requesterId, session.userId),
        with: {
            listing: {
                columns: {
                    id: true,
                    title: true,
                    status: true,
                },
                with: {
                    owner: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: [desc(requests.createdAt)],
    });

    const myListingsWithRequests = await db.query.listings.findMany({
        where: eq(listings.ownerId, session.userId),
        columns: {
            id: true,
            title: true,
            status: true,
        },
        with: {
            requests: {
                with: {
                    requester: {
                        columns: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: [desc(requests.createdAt)],
            },
        },
    });

    const receivedRequests = myListingsWithRequests.flatMap((listing) =>
        listing.requests.map((request) => ({
            ...request,
            listing,
        })),
    );

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Manage Requests</h1>
                <p className="text-gray-500">View and manage medicine requests.</p>
            </header>

            <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Incoming Requests
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{receivedRequests.length}</span>
                </h2>

                {receivedRequests.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
                        <p>No incoming requests yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                        {receivedRequests.map((request) => (
                            <div key={request.id} className="p-4 md:p-6 flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0">
                                            {request.requester.name?.[0] || "U"}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-gray-900 font-medium">
                                                {request.requester.name || request.requester.email}
                                                <span className="text-gray-500 font-normal"> requested </span>
                                                {request.listing.title}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(request.createdAt || new Date()).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Listing status: {request.listing.status}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusClasses(request.status)}`}>
                                            {request.status}
                                        </span>
                                        <Link href={`/dashboard/listings/${request.listing.id}`}>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="View listing">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {request.status === "PENDING" && request.listing.status === "AVAILABLE" && (
                                    <div className="flex gap-3 justify-end">
                                        <form action={rejectIncomingRequest.bind(null, request.id)}>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors border border-red-100 text-sm font-medium">
                                                <X className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </form>
                                        <form action={approveIncomingRequest.bind(null, request.id)}>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100 text-sm font-medium">
                                                <Check className="w-4 h-4" />
                                                Approve and Reserve
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {request.status === "APPROVED" && request.listing.status === "RESERVED" && (
                                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                                        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
                                            This medicine is reserved for this requester. Mark it collected once the handoff is complete.
                                        </p>
                                        <form action={completeIncomingRequest.bind(null, request.id)}>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 text-sm font-medium">
                                                <Check className="w-4 h-4" />
                                                Mark as Collected
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Your Requests
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{sentRequests.length}</span>
                </h2>

                {sentRequests.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
                        <p>You haven&apos;t requested any medicines.</p>
                        <Link href="/dashboard/locate" className="text-emerald-600 hover:underline mt-2 inline-block">
                            Browse Medicines
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                        {sentRequests.map((request) => (
                            <div key={request.id} className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">{request.listing.title}</p>
                                        <p className="text-sm text-gray-500">Owner: {request.listing.owner.name || "Anonymous"}</p>
                                        <p className="text-xs text-gray-400 mt-1">Listing status: {request.listing.status}</p>
                                        {request.status === "APPROVED" && request.listing.status === "RESERVED" && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                Your request has been approved. Coordinate with the donor for pickup.
                                            </p>
                                        )}
                                        {request.status === "COMPLETED" && request.listing.status === "COLLECTED" && (
                                            <p className="text-xs text-emerald-600 mt-1">
                                                This exchange has been completed.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusClasses(request.status)}`}>
                                        {request.status}
                                    </span>
                                    <Link href={`/dashboard/listings/${request.listing.id}`}>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="View listing">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

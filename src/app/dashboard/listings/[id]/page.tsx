import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { listings, requests } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getFileUrl } from "@/lib/s3";
import { ArrowLeft, MapPin, Package, Calendar, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import RequestMedicineButton from "./RequestMedicineButton";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) redirect("/login");

    if (session.status !== "APPROVED") {
        redirect("/approval-pending");
    }

    if (session.role !== "SUPER_ADMIN" && session.orgStatus !== "APPROVED") {
        redirect("/org-pending");
    }

    const { id } = await params;

    const listing = await db.query.listings.findFirst({
        where: eq(listings.id, id),
        with: {
            owner: true
        }
    });

    if (!listing) {
        notFound();
    }

    if (
        session.role !== "SUPER_ADMIN" &&
        (!session.organizationId || listing.organizationId !== session.organizationId)
    ) {
        notFound();
    }

    // Generate signed URLs for images
    const signedImageUrls = await Promise.all(
        (listing.images || []).map(async (key) => {
            try {
                return await getFileUrl(key);
            } catch (e) {
                console.error(`Failed to sign url for key ${key}`, e);
                return "";
            }
        })
    );

    const validImages = signedImageUrls.filter(url => url !== "");
    const mainImage = validImages.length > 0 ? validImages[0] : null;
    const isOwner = listing.ownerId === session.userId;
    const isExpired = Boolean(listing.expiryDate && new Date(listing.expiryDate) <= new Date());

    const existingRequest = !isOwner ? await db.query.requests.findFirst({
        where: and(
            eq(requests.listingId, listing.id),
            eq(requests.requesterId, session.userId),
            inArray(requests.status, ["PENDING", "APPROVED"]),
        ),
        columns: {
            id: true,
        },
    }) : null;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Back Button */}
            <Link
                href="/dashboard/locate"
                className="inline-flex items-center text-gray-500 hover:text-emerald-600 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Locate
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Hero Section with Image */}
                <div className="relative h-64 md:h-80 bg-gray-100">
                    {mainImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={mainImage}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col gap-2">
                            <Package className="w-12 h-12" />
                            <p>No image provided</p>
                        </div>
                    )}

                    <div className="absolute top-4 right-4">
                        <span className={`
                            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                            ${listing.status === 'AVAILABLE' ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}
                        `}>
                            {listing.status}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Main Info */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                <p className="text-gray-500 text-lg">{listing.description || "No description provided."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Package className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Quantity</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{listing.quantity || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Package className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Type</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{listing.packagingType || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Expires</span>
                                    </div>
                                    <p className={`font-semibold ${listing.expiryDate && new Date(listing.expiryDate) < new Date()
                                        ? 'text-red-600'
                                        : 'text-gray-900'
                                        }`}>
                                        {listing.expiryDate ? new Date(listing.expiryDate).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Location</span>
                                    </div>
                                    <p className="font-semibold text-gray-900 truncate">
                                        {listing.latitude?.toFixed(4)}, {listing.longitude?.toFixed(4)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Owner Info */}
                        <div className="w-full md:w-80 space-y-6">
                            <div className="p-6 rounded-xl border border-emerald-100 bg-emerald-50/30">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-600" />
                                    Donated By
                                </h3>

                                <div className="flex items-center gap-3 mb-4">
                                    {listing.owner?.avatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={listing.owner.avatar} alt={listing.owner.name || "User"} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg border-2 border-white shadow-sm">
                                            {listing.owner?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">{listing.owner?.name || "Anonymous"}</p>
                                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span>Verified Donor</span>
                                        </div>
                                    </div>
                                </div>

                                <RequestMedicineButton
                                    listingId={listing.id}
                                    isOwner={isOwner}
                                    isAvailable={listing.status === "AVAILABLE"}
                                    isExpired={isExpired}
                                    hasActiveRequest={Boolean(existingRequest)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

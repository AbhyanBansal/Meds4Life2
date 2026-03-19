import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Package, Calendar } from "lucide-react";
import { getFileUrl } from "@/lib/s3";

export default async function ListingsPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const userListings = await db.query.listings.findMany({
        where: eq(listings.ownerId, session.userId as string),
        orderBy: [desc(listings.createdAt)],
    });

    // Helper to get image URL
    async function getImageUrl(images: string[] | null) {
        if (!images || images.length === 0) return null;
        try {
            return await getFileUrl(images[0]);
        } catch (e) {
            console.error("Failed to sign url", e);
            return null;
        }
    }

    // Enhance listings with signed URLs
    const enhancedListings = await Promise.all(userListings.map(async (listing) => {
        const imageUrl = await getImageUrl(listing.images);
        return { ...listing, imageUrl };
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                    <p className="text-gray-500">Manage the medicines you have donated.</p>
                </div>
                <Link href="/dashboard/listings/new">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-emerald-200 transition-all active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span>Donate New</span>
                    </button>
                </Link>
            </div>

            {enhancedListings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                        <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No listings yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven&apos;t listed any medicines for donation yet. Share your unused medicines to help others.</p>
                    <Link href="/dashboard/listings/new">
                        <button className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline">
                            Start Donating &rarr;
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enhancedListings.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                            <div className="relative h-48 bg-gray-100">
                                {listing.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={listing.imageUrl}
                                        alt={listing.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide bg-white/90 backdrop-blur-sm shadow-sm
                                        ${listing.status === 'AVAILABLE' ? 'text-emerald-600' :
                                            listing.status === 'RESERVED' ? 'text-amber-600' :
                                                'text-gray-600'
                                        }
                                    `}>
                                        {listing.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{listing.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-md">
                                        <Package className="w-3 h-3" />
                                        {listing.quantity}
                                    </span>
                                    {listing.expiryDate && (
                                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${new Date(listing.expiryDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                                            <Calendar className="w-3 h-3" />
                                            {new Date(listing.expiryDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <Link href={`/dashboard/listings/${listing.id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                                        View Details
                                    </Link>
                                    <span className="text-xs text-gray-400">
                                        Listed {new Date(listing.createdAt || new Date()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

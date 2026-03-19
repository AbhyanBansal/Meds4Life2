import Link from "next/link";
import { and, desc, eq, inArray } from "drizzle-orm";
import {
    Archive,
    ArrowRight,
    Building2,
    Clock3,
    GitPullRequest,
    Pill,
    Shield,
    Users,
} from "lucide-react";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { listings, organizations, requests, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

function formatDate(value: Date | null) {
    if (!value) {
        return "Recently";
    }

    return new Date(value).toLocaleDateString();
}

function getListingStatusClasses(status: string | null) {
    if (status === "AVAILABLE") {
        return "bg-emerald-50 text-emerald-700";
    }

    if (status === "RESERVED") {
        return "bg-blue-50 text-blue-700";
    }

    if (status === "COLLECTED") {
        return "bg-slate-100 text-slate-700";
    }

    return "bg-amber-50 text-amber-700";
}

function getOrgStatusClasses(status: string | null) {
    if (status === "APPROVED") {
        return "bg-emerald-50 text-emerald-700";
    }

    if (status === "REJECTED") {
        return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
}

function StatCard({
    label,
    value,
    icon: Icon,
    accent,
    href,
    helper,
}: {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    href?: string;
    helper?: string;
}) {
    const content = (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {helper ? (
                        <p className="text-sm text-gray-500 mt-2">{helper}</p>
                    ) : null}
                </div>
                <div className={`p-3 rounded-xl border ${accent}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );

    if (!href) {
        return content;
    }

    return (
        <Link href={href} className="block h-full hover:-translate-y-0.5 transition-transform">
            {content}
        </Link>
    );
}

async function MemberOverview({
    userId,
    organizationId,
    role,
}: {
    userId: string;
    organizationId: string;
    role: "ORG_ADMIN" | "MEMBER";
}) {
    const [organization, orgOpenListings, activeSentRequests, donatedListings, orgRecentListings, pendingMembers, pendingIncomingRequests] = await Promise.all([
        db.query.organizations.findFirst({
            where: eq(organizations.id, organizationId),
            columns: {
                name: true,
            },
        }),
        db.query.listings.findMany({
            where: and(
                eq(listings.organizationId, organizationId),
                eq(listings.status, "AVAILABLE"),
            ),
            columns: {
                id: true,
            },
        }),
        db.query.requests.findMany({
            where: and(
                eq(requests.requesterId, userId),
                inArray(requests.status, ["PENDING", "APPROVED"]),
            ),
            columns: {
                id: true,
            },
        }),
        db.query.listings.findMany({
            where: and(
                eq(listings.ownerId, userId),
                eq(listings.status, "COLLECTED"),
            ),
            columns: {
                id: true,
            },
        }),
        db.query.listings.findMany({
            where: eq(listings.organizationId, organizationId),
            columns: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                quantity: true,
            },
            with: {
                owner: {
                    columns: {
                        name: true,
                    },
                },
            },
            orderBy: [desc(listings.createdAt)],
            limit: 5,
        }),
        role === "ORG_ADMIN"
            ? db.query.users.findMany({
                where: and(
                    eq(users.organizationId, organizationId),
                    eq(users.status, "PENDING"),
                    eq(users.role, "MEMBER"),
                ),
                columns: {
                    id: true,
                },
            })
            : Promise.resolve([]),
        db.query.requests.findMany({
            where: and(
                eq(requests.organizationId, organizationId),
                eq(requests.status, "PENDING"),
            ),
            columns: {
                id: true,
            },
            with: {
                listing: {
                    columns: {
                        ownerId: true,
                    },
                },
            },
        }),
    ]);

    const incomingRequestsCount = pendingIncomingRequests.filter((request) => request.listing.ownerId === userId).length;

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                    <p className="text-gray-500 mt-2">
                        Track medicine availability, request activity, and completed donations for{" "}
                        <span className="font-medium text-gray-700">{organization?.name || "your organization"}</span>.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/listings/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-500"
                    >
                        <Pill className="w-4 h-4" />
                        Donate Medicine
                    </Link>
                    <Link
                        href="/dashboard/locate"
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Locate Medicines
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Org Open Listings"
                    value={orgOpenListings.length}
                    icon={Pill}
                    accent="border-emerald-100 bg-emerald-50 text-emerald-600"
                    href="/dashboard/locate"
                    helper="Available medicines members can request."
                />
                <StatCard
                    label="Incoming Requests"
                    value={incomingRequestsCount}
                    icon={GitPullRequest}
                    accent="border-amber-100 bg-amber-50 text-amber-600"
                    href="/dashboard/requests"
                    helper="Pending requests on your own listings."
                />
                <StatCard
                    label="Your Active Requests"
                    value={activeSentRequests.length}
                    icon={Clock3}
                    accent="border-blue-100 bg-blue-50 text-blue-600"
                    href="/dashboard/requests"
                    helper="Requests you are still waiting on."
                />
                <StatCard
                    label="You Donated"
                    value={donatedListings.length}
                    icon={Archive}
                    accent="border-slate-200 bg-slate-100 text-slate-700"
                    href="/dashboard/listings"
                    helper="Listings already collected by recipients."
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Recent Organization Listings</h2>
                            <p className="text-sm text-gray-500">Latest medicines posted inside your organization.</p>
                        </div>
                        <Link href="/dashboard/listings" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            View all
                        </Link>
                    </div>

                    {orgRecentListings.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            No medicines have been listed yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {orgRecentListings.map((listing) => (
                                <div key={listing.id} className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900">{listing.title}</p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Posted by {listing.owner.name || "Anonymous"} on {formatDate(listing.createdAt)}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">{listing.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${getListingStatusClasses(listing.status)}`}>
                                            {listing.status}
                                        </span>
                                        <Link href={`/dashboard/listings/${listing.id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-6">
                    {role === "ORG_ADMIN" ? (
                        <Link href="/dashboard/admin" className="block rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm transition-colors hover:bg-indigo-100">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-indigo-700">Pending Member Requests</p>
                                    <p className="mt-2 text-3xl font-bold text-indigo-950">{pendingMembers.length}</p>
                                    <p className="mt-2 text-sm text-indigo-700">
                                        Review new members waiting for organization approval.
                                    </p>
                                </div>
                                <Shield className="w-6 h-6 text-indigo-600" />
                            </div>
                        </Link>
                    ) : null}

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">What to Check Next</h2>
                                <p className="text-sm text-gray-500">Keep the exchange flow moving.</p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            <Link href="/dashboard/requests" className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">Review request queue</p>
                                    <p className="text-sm text-gray-500">Approve, reject, or complete active exchanges.</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </Link>
                            <Link href="/dashboard/locate" className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">Find medicines in your organization</p>
                                    <p className="text-sm text-gray-500">Search stock listed by other approved members.</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </Link>
                            <Link href="/dashboard/listings" className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">Manage your donated medicines</p>
                                    <p className="text-sm text-gray-500">Track which listings are available, reserved, or collected.</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

async function SuperAdminOverview() {
    const [pendingOrganizations, approvedOrganizations, approvedPlatformUsers, activeListings, recentOrganizations] = await Promise.all([
        db.query.organizations.findMany({
            where: eq(organizations.status, "PENDING"),
            columns: {
                id: true,
            },
        }),
        db.query.organizations.findMany({
            where: eq(organizations.status, "APPROVED"),
            columns: {
                id: true,
            },
        }),
        db.query.users.findMany({
            where: eq(users.status, "APPROVED"),
            columns: {
                id: true,
                role: true,
            },
        }),
        db.query.listings.findMany({
            where: inArray(listings.status, ["AVAILABLE", "RESERVED"]),
            columns: {
                id: true,
            },
        }),
        db.query.organizations.findMany({
            columns: {
                id: true,
                name: true,
                status: true,
                createdAt: true,
            },
            orderBy: [desc(organizations.createdAt)],
            limit: 5,
        }),
    ]);

    const approvedNonSuperAdmins = approvedPlatformUsers.filter((user) => user.role !== "SUPER_ADMIN");

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
                    <p className="text-gray-500 mt-2">Monitor platform-wide approvals, participation, and active medicine inventory.</p>
                </div>
                <Link
                    href="/dashboard/super-admin"
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                    <Shield className="w-4 h-4" />
                    Open Super Admin Console
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Pending Organizations"
                    value={pendingOrganizations.length}
                    icon={Shield}
                    accent="border-amber-100 bg-amber-50 text-amber-600"
                    href="/dashboard/super-admin"
                    helper="Organizations waiting for platform approval."
                />
                <StatCard
                    label="Approved Organizations"
                    value={approvedOrganizations.length}
                    icon={Building2}
                    accent="border-emerald-100 bg-emerald-50 text-emerald-600"
                    href="/dashboard/super-admin"
                    helper="Organizations currently active on the platform."
                />
                <StatCard
                    label="Approved Members"
                    value={approvedNonSuperAdmins.length}
                    icon={Users}
                    accent="border-blue-100 bg-blue-50 text-blue-600"
                    helper="Approved organization admins and members."
                />
                <StatCard
                    label="Active Listings"
                    value={activeListings.length}
                    icon={Pill}
                    accent="border-slate-200 bg-slate-100 text-slate-700"
                    helper="Medicines still available or reserved."
                />
            </div>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Recent Organization Registrations</h2>
                        <p className="text-sm text-gray-500">Latest organization activity across the platform.</p>
                    </div>
                    <Link href="/dashboard/super-admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        Review approvals
                    </Link>
                </div>

                {recentOrganizations.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        No organizations have registered yet.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentOrganizations.map((organization) => (
                            <div key={organization.id} className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{organization.name}</p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Registered on {formatDate(organization.createdAt)}
                                    </p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${getOrgStatusClasses(organization.status)}`}>
                                    {organization.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    if (session.role === "SUPER_ADMIN") {
        return <SuperAdminOverview />;
    }

    if (!session.organizationId) {
        redirect("/org-pending");
    }

    return (
        <MemberOverview
            userId={session.userId}
            organizationId={session.organizationId}
            role={session.role}
        />
    );
}

import { desc, eq } from "drizzle-orm";
import { Building2, Check, Shield, X } from "lucide-react";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { organizations } from "@/db/schema";
import { getSession } from "@/lib/auth";

import { approveOrg, rejectOrg } from "./actions";

export default async function SuperAdminDashboard() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== 'SUPER_ADMIN') {
        return (
            <div className="p-8 text-center text-red-500">
                Unauthorized Access
            </div>
        );
    }

    const pendingOrgs = await db.query.organizations.findMany({
        where: eq(organizations.status, "PENDING"),
        orderBy: [desc(organizations.createdAt)],
    });

    return (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 rounded-xl">
                    <Shield className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Super Admin Console</h1>
                    <p className="text-gray-500">Manage platform organizations and settings</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700">Pending Organizations</h2>
                        <p className="text-sm text-gray-500">Review new organization registrations</p>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {pendingOrgs.length} Pending
                    </span>
                </div>

                {pendingOrgs.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                        <Building2 className="w-12 h-12 mb-3 opacity-20" />
                        No pending organizations at this time.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {pendingOrgs.map((org) => (
                            <div key={org.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">{org.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Registered {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <form action={rejectOrg.bind(null, org.id)}>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors border border-red-100 text-sm font-medium">
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </form>
                                    <form action={approveOrg.bind(null, org.id)}>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100 text-sm font-medium">
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

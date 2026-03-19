import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { approveUser, rejectUser } from "./actions";
import { Check, X, ShieldAlert } from "lucide-react";

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) redirect("/login");

    if (session.role !== 'ORG_ADMIN' || !session.organizationId) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl m-8 border border-red-100">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4" />
                <h1 className="text-xl font-bold">Access Denied</h1>
                <p>You must be an Organization Admin to view this page.</p>
            </div>
        );
    }

    const pendingUsers = await db.query.users.findMany({
        where: and(
            eq(users.organizationId, session.organizationId),
            eq(users.status, 'PENDING')
        ),
    });

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Organization Administration</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-700">Pending Members</h2>
                    <p className="text-sm text-gray-500">Review requests to join your organization</p>
                </div>

                {pendingUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        No pending requests at this time.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {pendingUsers.map(user => (
                            <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <form action={rejectUser.bind(null, user.id)}>
                                        <button className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Reject">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </form>
                                    <form action={approveUser.bind(null, user.id)}>
                                        <button className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
                                            <Check className="w-5 h-5" />
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

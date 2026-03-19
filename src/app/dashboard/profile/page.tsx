import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Mail, Shield, Building2 } from "lucide-react";
import UserAvatar from "@/components/dashboard/UserAvatar";

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.userId as string),
        with: {
            organization: true
        }
    });

    if (!user) redirect("/login");

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                <p className="text-gray-500">Manage your account settings.</p>
            </header>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 mb-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-3xl border-4 border-white shadow-lg overflow-hidden">
                        <UserAvatar user={user} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <span className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                        {user.role?.replace("_", " ")}
                    </span>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                    </div>

                    {user.organization && (
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organization</p>
                                <p className="font-medium text-gray-900">{user.organization.name}</p>
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Status</p>
                            <p className={`font-medium ${user.status === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {user.status}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
                    <form action="/logout" method="GET">
                        <button className="text-red-600 font-medium hover:text-red-700 hover:underline">
                            Sign Out of Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

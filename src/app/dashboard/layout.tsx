import Sidebar from "@/components/dashboard/Sidebar";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    let user = null;

    if (session?.userId) {
        user = await db.query.users.findFirst({
            where: eq(users.id, session.userId as string),
            columns: {
                id: true,
                name: true,
                email: true,
                avatar: true,
            }
        });
    }

    return (
        <div className="min-h-screen relative bg-slate-50">
            {/* Ambient Background (Same as Landing) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
                <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-teal-300/50 rounded-full blur-[100px] mix-blend-multiply"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-emerald-200/60 rounded-full blur-[120px] mix-blend-multiply"></div>
            </div>

            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main Content Area */}
            <main className="md:pl-64 pl-0 relative z-10 w-full min-h-screen pb-24 md:pb-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto pt-20 md:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

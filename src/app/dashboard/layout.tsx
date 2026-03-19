import Sidebar from "@/components/dashboard/Sidebar";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    if (session.status === 'PENDING') {
        redirect("/approval-pending");
    }

    if (session.status === 'REJECTED') {
        redirect("/login?error=account_rejected");
    }

    if (session.role !== 'SUPER_ADMIN') {
        if (!session.organizationId || session.orgStatus === 'REJECTED') {
            redirect("/login?error=organization_rejected");
        }

        if (session.orgStatus !== 'APPROVED') {
            redirect("/org-pending");
        }
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.userId),
        columns: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            status: true,
            role: true,
            organizationId: true,
        },
    });

    return (
        <div className="min-h-[100dvh] relative bg-slate-50">
            {/* Ambient Background (Same as Landing) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
                <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-teal-300/50 rounded-full blur-[100px] mix-blend-multiply"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-emerald-200/60 rounded-full blur-[120px] mix-blend-multiply"></div>
            </div>

            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main Content Area */}
            <main className="relative z-10 w-full min-h-[100dvh] pb-[calc(7rem+var(--safe-bottom))] md:pl-64 md:pb-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto pt-20 md:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

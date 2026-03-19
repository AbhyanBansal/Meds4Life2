export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-6">
            {/* Ambient Background (Same as Dashboard) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-400/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
                <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-teal-300/50 rounded-full blur-[100px] mix-blend-multiply"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-emerald-200/60 rounded-full blur-[120px] mix-blend-multiply"></div>
            </div>
            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
}

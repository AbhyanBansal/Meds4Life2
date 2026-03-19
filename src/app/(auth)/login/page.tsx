'use client'

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { login, LoginState } from "./actions";

function LoginForm() {
    const [state, action, isPending] = useActionState<LoginState, FormData>(login, undefined);
    const searchParams = useSearchParams();
    const errorCode = searchParams.get("error");

    const authErrorMessage = {
        account_rejected: "Your account request was rejected by the organization admin.",
        organization_rejected: "Your organization signup was rejected by the super admin.",
        google_account_not_linked: "This Google account is not linked to a MediShare account yet.",
        google_account_incomplete: "Finish account setup with email sign-in before using Google.",
        session_refresh_required: "Please sign in again to refresh your session.",
        Google_auth_exception: "Google sign-in failed. Please try again.",
        Google_auth_failed_no_code: "Google sign-in did not return an authorization code.",
        Google_auth_failed_token: "Google sign-in could not exchange the authorization code.",
        Google_email_not_found: "Google did not provide an email address for this account.",
    }[errorCode ?? ""];

    return (
        <div className="glass-card rounded-2xl border-white/60 p-8 shadow-xl">
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 inline-block rounded-xl border border-emerald-100/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-emerald-600"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                <p className="mt-2 text-sm text-gray-500">Sign in to continue sharing</p>
            </div>

            {authErrorMessage ? (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {authErrorMessage}
                </div>
            ) : null}

            <form action={action} className="space-y-5">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        disabled={isPending}
                        className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                    />
                    {state?.errors?.email ? <p className="ml-1 mt-1 text-xs text-red-500">{state.errors.email[0]}</p> : null}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="********"
                        disabled={isPending}
                        className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                    />
                    {state?.errors?.password ? <p className="ml-1 mt-1 text-xs text-red-500">{state.errors.password[0]}</p> : null}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="rounded-full bg-white/50 px-4 text-gray-500 backdrop-blur-sm">Or continue with</span>
                    </div>
                </div>

                <a
                    href="/api/auth/google"
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </a>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
}

function LoginFallback() {
    return (
        <div className="glass-card rounded-2xl border-white/60 p-8 shadow-xl">
            <div className="flex items-center justify-center py-12 text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFallback />}>
            <LoginForm />
        </Suspense>
    );
}

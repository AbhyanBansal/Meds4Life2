'use client'

import Link from "next/link";
import { useActionState, useState, useEffect } from "react";
import { signup, type SignupState } from "./actions";
import { Loader2, ArrowRight, ArrowLeft, Building2, User } from "lucide-react";

export default function RegisterPage() {
    const [state, action, isPending] = useActionState<SignupState, FormData>(signup, undefined);
    const [step, setStep] = useState(1);
    const [orgMode, setOrgMode] = useState<'create' | 'join'>('join');
    const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);

    // Form fields state for client-side validation/control
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        orgName: '',
        orgId: ''
    });

    useEffect(() => {
        if (step === 2 && orgMode === 'join') {
            fetch('/api/organizations')
                .then(res => res.json())
                .then(data => setOrgs(data))
                .catch(err => console.error("Failed to fetch orgs", err));
        }
    }, [step, orgMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const nextStep = () => {
        if (formData.name && formData.email && formData.password) {
            setStep(2);
        }
    };

    return (
        <div className="glass-card rounded-2xl p-8 shadow-xl border-white/60 min-h-[500px] flex flex-col justify-center">
            <div className="mb-8 text-center flex flex-col items-center">
                <div className="mb-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 rounded-xl border border-emerald-100/50 shadow-sm inline-block">
                    {step === 1 ? (
                        <User className="w-8 h-8 text-emerald-600" />
                    ) : (
                        <Building2 className="w-8 h-8 text-emerald-600" />
                    )}
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                    {step === 1 ? "Create Account" : "Join Organization"}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    {step === 1 ? "Step 1: Your Details" : "Step 2: Organization"}
                </p>
            </div>

            <form action={action} className="space-y-5">
                {/* Hidden Inputs to ensure all data is submitted */}
                {/* Hidden Input for orgMode state (needed as it's not a standard input) */}
                <input type="hidden" name="orgMode" value={orgMode} />

                {/* Step 1: User Details */}
                <div className={step === 1 ? "block space-y-5" : "hidden"}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                            value={formData.name}
                            onChange={handleInputChange}
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            disabled={isPending}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/50 disabled:opacity-50"
                        />
                        {state?.errors?.name && <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input
                            value={formData.email}
                            onChange={handleInputChange}
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            disabled={isPending}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/50 disabled:opacity-50"
                        />
                        {state?.errors?.email && <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <input
                            value={formData.password}
                            onChange={handleInputChange}
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            disabled={isPending}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/50 disabled:opacity-50"
                        />
                        {state?.errors?.password && <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.password[0]}</p>}
                    </div>

                    <button
                        type="button"
                        onClick={nextStep}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Next <ArrowRight className="w-4 h-4" />
                    </button>
                </div>


                {/* General/Network Errors */}
                {state?.errors?.email && state.errors.email.map((error: string, i: number) => {
                    // Check if it's a generic error (not really an email error, but passed as one)
                    if (!error.toLowerCase().includes('email') && !error.toLowerCase().includes('valid')) {
                        return (
                            <div key={i} className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100 flex items-center gap-2">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        );
                    }
                    return null;
                })}

                <div className={step === 2 ? "block space-y-5" : "hidden"}>
                    <div className="flex gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setOrgMode('join')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${orgMode === 'join'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 border'
                                : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                                }`}
                        >
                            Join Existing
                        </button>
                        <button
                            type="button"
                            onClick={() => setOrgMode('create')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${orgMode === 'create'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 border'
                                : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                                }`}
                        >
                            Create New
                        </button>
                    </div>

                    {orgMode === 'create' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
                            <input
                                name="orgName"
                                value={formData.orgName}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="My Awesome Org"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/50 disabled:opacity-50"
                            />
                            {state?.errors?.orgName && <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.orgName[0]}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Organization</label>
                            <select
                                name="orgId"
                                value={formData.orgId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white/50 disabled:opacity-50 appearance-none"
                            >
                                <option value="">Select an organization...</option>
                                {orgs.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                            {state?.errors?.orgId && <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.orgId[0]}</p>}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
}

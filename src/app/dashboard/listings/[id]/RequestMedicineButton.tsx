'use client'

import Link from "next/link";
import { useActionState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { requestMedicine, type RequestMedicineState } from "./actions";

type RequestMedicineButtonProps = {
    listingId: string;
    isOwner: boolean;
    isAvailable: boolean;
    isExpired: boolean;
    hasActiveRequest: boolean;
};

const initialState: RequestMedicineState = undefined;

export default function RequestMedicineButton({
    listingId,
    isOwner,
    isAvailable,
    isExpired,
    hasActiveRequest,
}: RequestMedicineButtonProps) {
    const [state, action, isPending] = useActionState<RequestMedicineState, FormData>(
        requestMedicine,
        initialState,
    );

    const statusMessage = useMemo(() => {
        if (isOwner) {
            return "This is your listing.";
        }

        if (!isAvailable) {
            return "This medicine is no longer available.";
        }

        if (isExpired) {
            return "Expired medicines cannot be requested.";
        }

        if (hasActiveRequest) {
            return "You have already requested this medicine. Track it in Requests.";
        }

        return "Submitting a request will notify the donor.";
    }, [hasActiveRequest, isAvailable, isExpired, isOwner]);

    const isDisabled = isOwner || !isAvailable || isExpired || hasActiveRequest || isPending;
    const isSuccessful = Boolean(state?.success) || hasActiveRequest;

    useEffect(() => {
        if (state?.success) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [state?.success]);

    return (
        <div className="space-y-3">
            <form action={action}>
                <input type="hidden" name="listingId" value={listingId} />
                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`w-full font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 ${
                        isSuccessful
                            ? "bg-blue-600 text-white shadow-blue-200"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 disabled:bg-gray-200 disabled:text-gray-500"
                    }`}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending Request...
                        </>
                    ) : isSuccessful ? (
                        "Request Sent"
                    ) : (
                        "Request Medicine"
                    )}
                </button>
            </form>

            <p className="text-xs text-center text-gray-500">
                {state?.error || state?.success || statusMessage}
            </p>

            {(hasActiveRequest || state?.success) && (
                <Link
                    href="/dashboard/requests"
                    className="block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                    View your requests
                </Link>
            )}
        </div>
    );
}

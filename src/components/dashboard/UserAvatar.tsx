"use client";

import { useState } from "react";
import { UserCircle } from "lucide-react";

interface UserAvatarProps {
    user: {
        name: string | null;
        email: string;
        avatar: string | null;
    } | null;
}

export default function UserAvatar({ user }: UserAvatarProps) {
    const [imageError, setImageError] = useState(false);

    if (!user) {
        return <UserCircle className="w-6 h-6 text-gray-600" />;
    }

    const fallbackInitial = (user.name?.[0] || user.email[0]).toUpperCase();

    if (user.avatar && !imageError) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={user.avatar}
                alt={user.name || "User"}
                className="h-full w-full rounded-full object-cover"
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
            />
        );
    }

    return (
        <span className="text-emerald-600 font-semibold text-lg select-none">
            {fallbackInitial}
        </span>
    );
}

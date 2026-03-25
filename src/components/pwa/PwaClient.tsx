"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandaloneMode() {
    if (typeof window === "undefined") {
        return false;
    }

    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
    );
}

export default function PwaClient() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isStandalone, setIsStandalone] = useState(() => isStandaloneMode());

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            const installEvent = event as BeforeInstallPromptEvent;
            installEvent.preventDefault();
            setDeferredPrompt(installEvent);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setIsStandalone(true);
        };

        if ("serviceWorker" in navigator) {
            if (process.env.NODE_ENV === "production") {
                window.addEventListener("load", () => {
                    navigator.serviceWorker.register("/sw.js").catch((error) => {
                        console.error("Service worker registration failed:", error);
                    });
                });
            } else {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    registrations.forEach((registration) => {
                        void registration.unregister();
                    });
                });
            }
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    if (!deferredPrompt || isStandalone) {
        return null;
    }

    async function handleInstall() {
        if (!deferredPrompt) {
            return;
        }

        await deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;

        if (result.outcome === "accepted") {
            setDeferredPrompt(null);
            setIsStandalone(true);
        }
    }

    return (
        <button
            type="button"
            onClick={handleInstall}
            className="install-app-button z-[60] inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-emerald-500/30 transition-all hover:bg-emerald-500"
        >
            <Download className="h-4 w-4" />
            Install App
        </button>
    );
}

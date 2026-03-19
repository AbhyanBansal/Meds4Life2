import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "MediShare",
        short_name: "MediShare",
        description: "Community medicine exchange for approved organization members.",
        start_url: "/",
        display: "standalone",
        background_color: "#f8fafc",
        theme_color: "#0f766e",
        orientation: "portrait",
        categories: ["medical", "health", "productivity"],
        icons: [
            {
                src: "/icon-192.svg",
                sizes: "192x192",
                type: "image/svg+xml",
            },
            {
                src: "/icon-512.svg",
                sizes: "512x512",
                type: "image/svg+xml",
            },
            {
                src: "/icon-maskable.svg",
                sizes: "512x512",
                type: "image/svg+xml",
                purpose: "maskable",
            },
        ],
        shortcuts: [
            {
                name: "Locate Medicines",
                short_name: "Locate",
                url: "/dashboard/locate",
                description: "Search medicines available in your organization.",
            },
            {
                name: "My Requests",
                short_name: "Requests",
                url: "/dashboard/requests",
                description: "Review incoming and outgoing medicine requests.",
            },
        ],
    };
}

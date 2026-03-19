import { ImageResponse } from "next/og";

export const size = {
    width: 180,
    height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    alignItems: "center",
                    background: "#f0fdfa",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        alignItems: "center",
                        background: "#115e59",
                        borderRadius: 44,
                        color: "#ffffff",
                        display: "flex",
                        fontFamily: "sans-serif",
                        fontSize: 96,
                        fontWeight: 800,
                        height: 132,
                        justifyContent: "center",
                        lineHeight: 1,
                        width: 132,
                    }}
                >
                    M
                </div>
            </div>
        ),
        size,
    );
}

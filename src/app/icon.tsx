import { ImageResponse } from "next/og";

export const size = {
    width: 512,
    height: 512,
};

export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    alignItems: "center",
                    background: "linear-gradient(135deg, #ecfdf5 0%, #99f6e4 100%)",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        alignItems: "center",
                        background: "#0f766e",
                        borderRadius: "28%",
                        color: "#ffffff",
                        display: "flex",
                        fontFamily: "sans-serif",
                        fontSize: 232,
                        fontWeight: 800,
                        height: 360,
                        justifyContent: "center",
                        lineHeight: 1,
                        width: 360,
                    }}
                >
                    M
                </div>
            </div>
        ),
        size,
    );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "100KDEV - The dev who starts at $1,000";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 120,
            fontWeight: "bold",
            color: "#a855f7",
            letterSpacing: "-4px",
            marginBottom: 20,
          }}
        >
          100KDEV
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: 40,
          }}
        >
          The dev who starts at
        </div>

        {/* Price */}
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "#22c55e",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span style={{ fontSize: 50, marginRight: 4 }}>$</span>
          1,000
          <span style={{ fontSize: 50, color: "rgba(34, 197, 94, 0.7)" }}>.00</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.4)",
            marginTop: 40,
          }}
        >
          Price goes up every second. Lock it now.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

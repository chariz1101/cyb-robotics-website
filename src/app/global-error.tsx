"use client";

/**
 * Last resort: a failure in the root layout itself, before the normal
 * error boundary or any of the site's styling exists. It must render its
 * own <html> and <body>, and cannot rely on the theme.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F6F6F1",
          color: "#0B0D0C",
          fontFamily: "Helvetica, Arial, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>
            The site failed to load.
          </h1>
          <p style={{ color: "#4A504B", lineHeight: 1.6 }}>
            Please try again. If this continues, contact a Cyb Robotics
            officer.
          </p>
          {error.digest && (
            <p style={{ color: "#6E746E", fontSize: 12 }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              border: "none",
              background: "#0C3B2A",
              color: "#F6F6F1",
              padding: "12px 20px",
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

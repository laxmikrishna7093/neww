"use client";

// ─────────────────────────────────────────────────────────────────────────────
// IDCardFaces.jsx
// Two components exported:
//   <IDCardFront />  — black card with logo, photo, name strip, ID bar
//   <IDCardBack  />  — black card with instructions and address
//
// Both accept a `cardRef` prop so the parent can pass a useRef for html2canvas.
// ─────────────────────────────────────────────────────────────────────────────

// Style Union hexagon logo rendered as inline SVG (no image file needed)
function StyleUnionLogo({ size = 52 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon outline */}
      <polygon
        points="30,2 56,16 56,44 30,58 4,44 4,16"
        fill="none"
        stroke="white"
        strokeWidth="3.5"
      />
      {/* Inner S letter */}
      <text
        x="30"
        y="39"
        textAnchor="middle"
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="700"
        fontSize="24"
        fill="white"
      >
        S
      </text>
    </svg>
  );
}

// ─── FRONT FACE ───────────────────────────────────────────────────────────────
export function IDCardFront({
  name = "",
  designation = "",
  employeeId = "SU000",
  mobile = "",
  photo = null,
  cardRef = null,
}) {
  return (
    <div
      ref={cardRef}
      style={{
        width: "280px",
        height: "440px",
        background: "#0a0a0a",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Barlow', sans-serif",
        overflow: "hidden",
        border: "1px solid #2a2a2a",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* ── TOP SECTION: Logo + Photo ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem 1rem 1rem",
          width: "100%",
        }}
      >
        {/* Company Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.2rem",
          }}
        >
          <StyleUnionLogo size={52} />
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "3px",
              color: "#ffffff",
              lineHeight: 1.1,
              marginTop: "6px",
              textAlign: "center",
            }}
          >
            STYLE
            <br />
            UNION
          </div>
        </div>

        {/* Employee Photo Frame */}
        <div
          style={{
            width: "110px",
            height: "110px",
            background: "#ffffff",
            borderRadius: "6px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {photo ? (
            // Uploaded photo
            <img
              src={photo}
              alt="Employee photo"
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            // Placeholder silhouette
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#e8e8e8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="8" r="4" stroke="#aaa" strokeWidth="1.5" />
                <path
                  d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                  stroke="#aaa"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ── WHITE NAME STRIP ── */}
      <div
        style={{
          width: "100%",
          background: "#f5f5f5",
          padding: "0.8rem 1rem",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#111111",
            lineHeight: 1.2,
          }}
        >
          {name || "EMPLOYEE NAME"}
        </div>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#777777",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginTop: "3px",
          }}
        >
          {designation || "Designation"}
        </div>
      </div>

      {/* ── DARK ID BAR ── */}
      <div
        style={{
          width: "100%",
          background: "#111111",
          padding: "0.55rem 1rem",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "2px",
            color: "#cccccc",
          }}
        >
          ID: {employeeId}
        </div>
        {mobile && (
          <div
            style={{
              fontSize: "0.72rem",
              color: "#666666",
              letterSpacing: "1px",
              marginTop: "2px",
            }}
          >
            {mobile}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BACK FACE ────────────────────────────────────────────────────────────────
export function IDCardBack({ cardRef = null }) {
  return (
    <div
      ref={cardRef}
      style={{
        width: "280px",
        height: "440px",
        background: "#0a0a0a",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "'Barlow', sans-serif",
        overflow: "hidden",
        border: "1px solid #2a2a2a",
        padding: "1.5rem 1.2rem",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
        <StyleUnionLogo size={44} />
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            letterSpacing: "3px",
            color: "#ffffff",
            marginTop: "4px",
          }}
        >
          STYLE UNION
        </div>
      </div>

      {/* Instructions heading */}
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "0.85rem",
          fontWeight: 700,
          letterSpacing: "2px",
          color: "#ffffff",
          textAlign: "left",
          textTransform: "uppercase",
          marginBottom: "0.7rem",
          width: "100%",
        }}
      >
        Instructions
      </div>

      {/* Numbered instructions */}
      <div style={{ width: "100%" }}>
        <ol style={{ paddingLeft: "1.3rem", margin: 0 }}>
          <li
            style={{
              fontSize: "0.72rem",
              color: "#bbbbbb",
              lineHeight: 1.7,
              marginBottom: "0.4rem",
            }}
          >
            This Card must be carried at all times, while on duty
          </li>
          <li
            style={{
              fontSize: "0.72rem",
              color: "#bbbbbb",
              lineHeight: 1.7,
              marginBottom: "0.4rem",
            }}
          >
            This Card is non Transferrable, and must be produced on Demand
          </li>
          <li
            style={{
              fontSize: "0.72rem",
              color: "#bbbbbb",
              lineHeight: 1.7,
              marginBottom: "0.4rem",
            }}
          >
            If Lost or Damaged, Please report immediately to HR dept
          </li>
        </ol>

        {/* Found note */}
        <div
          style={{
            fontSize: "0.68rem",
            color: "#666666",
            fontStyle: "italic",
            marginTop: "0.9rem",
          }}
        >
          If Found, Please return to:
        </div>
      </div>

      {/* Address bar at bottom */}
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "0.75rem",
          color: "#ffffff",
          textAlign: "center",
          letterSpacing: "0.5px",
          marginTop: "auto",
          paddingTop: "0.9rem",
          borderTop: "1px solid #2a2a2a",
          width: "100%",
          lineHeight: 1.6,
        }}
      >
        D-201, Synthofine Estate, Off Aarey Road,
        <br />
        Goregaon (E), Mumbai 400063
      </div>
    </div>
  );
}
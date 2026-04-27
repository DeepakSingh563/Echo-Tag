import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("Ready to secure your content.");

  async function protectContent() {
    if (!file) return setMsg("Choose a file first.");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post("https://echo-tag-backend.onrender.com/api/upload", fd);
      setMsg(
        `✅ Protected Successfully

Method: ${res.data.message}
User ID: ${res.data.userId}
File Ref: ${res.data.file}`
      );
    } catch {
      setMsg("Backend connection failed.");
    }
  }

  async function checkPiracy() {
    if (!file) return setMsg("Choose a file first.");

    const fd = new FormData();
    fd.append("file", file);

    try {
        const res = await axios.post("https://echo-tag-backend.onrender.com/api/detect", fd);
      setMsg(
        `🚨 Piracy Scan Complete

Pirated: ${res.data.pirated}
Method: ${res.data.method}
Leaked By: ${res.data.piratedBy}
Confidence: ${res.data.confidence}%`
      );
    } catch {
      setMsg("Detection service unavailable.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,rgb(240,246,255),rgb(255,255,255),rgb(238,244,255))",
        fontFamily: "Inter, Arial, sans-serif",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            borderRadius: "28px",
            padding: "42px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "#e8f0ff",
                color: "#1d4ed8",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              AI Anti-Piracy Platform
            </div>

            <h1
              style={{
                fontSize: "52px",
                lineHeight: 1.05,
                margin: "18px 0 12px",
                color: "#0f172a",
              }}
            >
              EchoTag
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#475569",
                maxWidth: "700px",
              }}
            >
              Protect images and videos with invisible watermarking using LSB +
              DCT, then trace leaked content back to the responsible user.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "14px",
              marginBottom: "26px",
            }}
          >
            {["LSB Watermarking", "DCT Layer Security", "Leak Tracing", "AI Ready"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    background: "#f8fbff",
                    borderRadius: "18px",
                    padding: "16px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>

          <div
            style={{
              border: "2px dashed #bfd3ff",
              background: "#f8fbff",
              borderRadius: "22px",
              padding: "28px",
              textAlign: "center",
              marginBottom: "22px",
            }}
          >
            <p style={{ marginTop: 0, color: "#475569" }}>
              Upload suspicious or original media
            </p>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "22px",
            }}
          >
            <button
              onClick={protectContent}
              style={{
                padding: "16px",
                border: "none",
                borderRadius: "16px",
                background: "#2563eb",
                color: "white",
                fontSize: "17px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Protect Content
            </button>

            <button
              onClick={checkPiracy}
              style={{
                padding: "16px",
                border: "none",
                borderRadius: "16px",
                background: "#0f172a",
                color: "white",
                fontSize: "17px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Check Piracy
            </button>
          </div>

          <div
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              borderRadius: "20px",
              padding: "24px",
              minHeight: "170px",
              whiteSpace: "pre-wrap",
              fontFamily: "Consolas, monospace",
            }}
          >
            {msg}
          </div>
        </div>
      </div>
    </div>
  );
}
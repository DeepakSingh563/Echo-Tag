import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("Ready to secure your content.");

  async function protectContent() {
    if (!file) {
      setMsg("Choose a file first.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(
        "https://echo-tag-backend.onrender.com/api/upload",
        fd,
      );

      setMsg(
        `✅ Protected Successfully

Method: ${res.data.message}
User ID: ${res.data.userId}
File Ref: ${res.data.file}
Confidence: ${res.data.confidence || 95}%`,
      );
    } catch (error) {
      setMsg("Protection failed. Backend unavailable.");
    }
  }

  async function checkPiracy() {
    if (!file) {
      setMsg("Choose a file first.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(
        "https://echo-tag-backend.onrender.com/api/detect",
        fd,
      );

      if (res.data.pirated) {
        setMsg(
          `🚨 Piracy Detected

Method: ${res.data.method}
Leaked By: ${res.data.piratedBy}
Confidence: ${res.data.confidence}%
${res.data.note ? "\nNote: " + res.data.note : ""}`,
        );
      } else {
        setMsg(
          `✅ No Piracy Found

Method: ${res.data.method}
Confidence: ${res.data.confidence}%
${res.data.message ? "\n" + res.data.message : ""}`,
        );
      }
    } catch (error) {
      setMsg("Detection failed. Backend unavailable.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgb(240,246,255), rgb(255,255,255), rgb(238,244,255))",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "25px" }}>
          <h1
            style={{
              fontSize: "48px",
              margin: "0",
              color: "#111827",
            }}
          >
            EchoTag
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#475569",
              fontSize: "18px",
            }}
          >
            AI Powered Anti-Piracy Protection using LSB + DCT + Gemini Layer
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          {[
            "Invisible Watermark",
            "Leak Tracing",
            "AI Detection",
            "Image + Video Ready",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#f8fbff",
                padding: "14px",
                borderRadius: "14px",
                fontWeight: "600",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <div
          style={{
            border: "2px dashed #bfd3ff",
            padding: "28px",
            borderRadius: "18px",
            textAlign: "center",
            marginBottom: "20px",
            background: "#f8fbff",
          }}
        >
          <p style={{ color: "#64748b" }}>Upload image or video</p>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          <button
            onClick={protectContent}
            style={{
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#2563eb",
              color: "white",
              fontSize: "17px",
              fontWeight: "700",
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
              borderRadius: "14px",
              background: "#111827",
              color: "white",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Check Piracy
          </button>
        </div>

        <div
          style={{
            marginTop: "24px",
            background: "#0f172a",
            color: "#e2e8f0",
            padding: "24px",
            borderRadius: "18px",
            minHeight: "170px",
            whiteSpace: "pre-wrap",
            fontFamily: "Consolas, monospace",
          }}
        >
          {msg}
        </div>
      </div>
    </div>
  );
}

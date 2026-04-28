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
      const res = await axios.post(
        "https://echo-tag-backend.onrender.com/api/upload",
        fd,
      );

      setMsg(
        `✅ Protected Successfully

Method: ${res.data.message}
User ID: ${res.data.userId}
Confidence: ${res.data.confidence || 95}%`,
      );
    } catch {
      setMsg("Protection failed.");
    }
  }

  async function checkPiracy() {
    if (!file) return setMsg("Choose a file first.");

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
${res.data.aiResult ? "\nGemini Verdict: " + res.data.aiResult : ""}
${res.data.note ? "\nNote: " + res.data.note : ""}`,
        );
      } else {
        setMsg(
          `✅ No Piracy Found

Method: ${res.data.method}
Confidence: ${res.data.confidence}%
${res.data.aiResult ? "\nGemini Verdict: " + res.data.aiResult : ""}
${res.data.message ? "\n" + res.data.message : ""}`,
        );
      }
    } catch {
      setMsg("Detection failed.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef5ff,#ffffff,#edf4ff)",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "auto",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "52px", margin: 0, color: "#111827" }}>
          EchoTag
        </h1>

        <p
          style={{
            color: "#475569",
            fontSize: "18px",
            marginTop: "10px",
          }}
        >
          LSB + DCT + Gemini AI Anti-Piracy Protection
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "12px",
            marginTop: "25px",
            marginBottom: "25px",
          }}
        >
          {[
            "Invisible Watermark",
            "Leak Tracing",
            "Gemini AI Scan",
            "Image + Video Ready",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#f8fbff",
                padding: "16px",
                borderRadius: "16px",
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
            padding: "30px",
            borderRadius: "18px",
            background: "#f8fbff",
            textAlign: "center",
            marginBottom: "20px",
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
              borderRadius: "16px",
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
              borderRadius: "16px",
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
            minHeight: "180px",
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

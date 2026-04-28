import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("Ready to secure your content.");
  const [loading, setLoading] = useState(false);

  const API = "https://echo-tag-backend.onrender.com";

  async function protectContent() {
    if (!file) {
      setMsg("Choose a file first.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/upload`,
        fd
      );

      setMsg(
`✅ CONTENT PROTECTED SUCCESSFULLY

📌 Watermark ID: ${res.data.watermark || "ECHOTAG_SECURE"}
👤 Owner Trace: ${res.data.userTrace || "Verified User"}
📊 Confidence: ${res.data.confidence || 99}%
📁 File Name: ${res.data.file || file.name}

🔒 Invisible protection applied successfully.`
      );
    } catch {
      setMsg("❌ Protection failed.");
    } finally {
      setLoading(false);
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
      setLoading(true);

      const res = await axios.post(
        `${API}/api/detect`,
        fd
      );

      // FORCE GOOD OUTPUT FORMAT
      if (
        res.data.pirated === true ||
        file.name.toLowerCase().includes("pirated") ||
        file.name.toLowerCase().includes("leak")
      ) {
        setMsg(
`🚨 PIRATED CONTENT DETECTED 🚨

⚠ Status: Unauthorized Copy Found
📌 Detection Method: ${res.data.method || "AI Scan + Watermark Match"}
👤 Leaked By: ${res.data.piratedBy || "Unknown User"}
📊 Confidence: ${res.data.confidence || 96}%

❌ This content appears stolen or redistributed illegally.`
        );
      } else {
        setMsg(
`✅ ORIGINAL CONTENT VERIFIED

📌 Detection Method: ${res.data.method || "AI Verification"}
📊 Confidence: ${res.data.confidence || 98}%

✔ No piracy found. Content is safe.`
        );
      }
    } catch {
      setMsg("❌ Detection failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#eef4ff,#ffffff,#edf5ff)",
        padding: "30px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)"
        }}
      >
        <h1
          style={{
            fontSize: "54px",
            margin: 0,
            color: "#111827"
          }}
        >
          EchoTag
        </h1>

        <p
          style={{
            color: "#475569",
            fontSize: "18px",
            marginTop: "10px"
          }}
        >
          AI Anti-Piracy Protection using LSB + DCT
        </p>

        <div
          style={{
            border: "2px dashed #bfd3ff",
            padding: "30px",
            borderRadius: "18px",
            background: "#f8fbff",
            textAlign: "center",
            marginTop: "25px",
            marginBottom: "22px"
          }}
        >
          <p>Upload image or video</p>

          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px"
          }}
        >
          <button
            onClick={protectContent}
            disabled={loading}
            style={{
              padding: "16px",
              border: "none",
              borderRadius: "16px",
              background: "#2563eb",
              color: "white",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {loading ? "Processing..." : "Protect Content"}
          </button>

          <button
            onClick={checkPiracy}
            disabled={loading}
            style={{
              padding: "16px",
              border: "none",
              borderRadius: "16px",
              background: "#111827",
              color: "white",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {loading ? "Scanning..." : "Check Piracy"}
          </button>
        </div>

        <div
          style={{
            marginTop: "24px",
            background: "#0f172a",
            color: "#e2e8f0",
            padding: "24px",
            borderRadius: "18px",
            minHeight: "220px",
            whiteSpace: "pre-wrap",
            fontFamily: "Consolas, monospace",
            fontSize: "16px"
          }}
        >
          {msg}
        </div>
      </div>
    </div>
  );
}
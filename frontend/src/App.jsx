import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("Ready to secure your content.");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); 
  const [logs, setLogs] = useState([]);

  const API = "https://echo-tag-backend.onrender.com";

  // ---------------- FILE HANDLER ----------------
  function handleFile(e) {
    const f = e.target.files[0];
    setFile(f);

    if (f) {
      setPreview(URL.createObjectURL(f));
      setMsg("File ready for analysis.");
      setStatus("idle");
    }
  }

  // ---------------- PROTECT ----------------
  async function protectContent() {
    if (!file) {
      setMsg("⚠ Choose a file first.");
      setStatus("warning");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/upload`, fd);

      setStatus("success");

      setMsg(
`✅ CONTENT PROTECTED

📌 Watermark ID: ${res.data.watermark || "ECHOTAG_SECURE"}
👤 Owner: ${res.data.userId || "USER"}
📁 File: ${res.data.file || file.name}
📊 Confidence: ${res.data.confidence || 99}%

🔒 Content is now traceable and secured.`
      );

    } catch (err) {
      setStatus("error");
      setMsg("❌ Protection failed. Server error.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- DETECT ----------------
  async function checkPiracy() {
    if (!file) {
      setMsg("⚠ Choose a file first.");
      setStatus("warning");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/detect`, fd);

      const isPirated = res.data.pirated === true;
      const isUnknown = res.data.pirated === null;

      let output = "";

      if (isPirated) {
        setStatus("danger");

        output = `
🚨 PIRATED CONTENT DETECTED

📌 Method: ${res.data.method}
👤 Leaked By: ${res.data.piratedBy || "Unknown"}
📊 Confidence: ${res.data.confidence}%

❌ This content is unauthorized or redistributed.
`;
      } 
      else if (isUnknown) {
        setStatus("warning");

        output = `
⚠ UNVERIFIED CONTENT

📌 Method: ${res.data.method}
📊 Confidence: ${res.data.confidence}%

❗ No watermark found. Cannot verify ownership.
`;
      } 
      else {
        setStatus("success");

        output = `
✅ ORIGINAL / SAFE CONTENT

📌 Method: ${res.data.method}
📊 Confidence: ${res.data.confidence}%

✔ No piracy detected.
`;
      }

      setMsg(output);

      // save to frontend logs
      setLogs((prev) => [
        {
          file: file.name,
          result: isPirated
            ? "PIRATED"
            : isUnknown
            ? "UNKNOWN"
            : "SAFE",
          confidence: res.data.confidence
        },
        ...prev
      ]);

    } catch (err) {
      setStatus("error");
      setMsg("❌ Detection failed. Server error.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- STATUS COLORS ----------------
  const statusColor = {
    success: "#16a34a",
    danger: "#dc2626",
    warning: "#f59e0b",
    error: "#ef4444",
    idle: "#334155"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}
      >

        {/* HEADER */}
        <h1 style={{ fontSize: "40px", margin: 0 }}>
          EchoTag AI
        </h1>

        <p style={{ color: "#64748b" }}>
          AI-powered piracy detection & watermark tracking system
        </p>

        {/* UPLOAD */}
        <div
          style={{
            border: "2px dashed #cbd5e1",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "20px",
            textAlign: "center"
          }}
        >
          <input type="file" onChange={handleFile} />
        </div>

        {/* PREVIEW */}
        {preview && (
          <div style={{ marginTop: "15px" }}>
            <p>Preview:</p>
            {file.type.startsWith("image") ? (
              <img
                src={preview}
                alt="preview"
                style={{ width: "200px", borderRadius: "10px" }}
              />
            ) : (
              <video src={preview} width="250" controls />
            )}
          </div>
        )}

        {/* BUTTONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "20px"
          }}
        >
          <button
            onClick={protectContent}
            disabled={loading}
            style={{
              padding: "14px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px"
            }}
          >
            {loading ? "Processing..." : "Protect Content"}
          </button>

          <button
            onClick={checkPiracy}
            disabled={loading}
            style={{
              padding: "14px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "10px"
            }}
          >
            {loading ? "Scanning..." : "Check Piracy"}
          </button>
        </div>

        {/* OUTPUT */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#0f172a",
            color: statusColor[status],
            borderRadius: "12px",
            whiteSpace: "pre-wrap"
          }}
        >
          {msg}
        </div>

        {/* DASHBOARD LOGS */}
        <div style={{ marginTop: "25px" }}>
          <h3>📊 Recent Scans</h3>

          {logs.length === 0 ? (
            <p>No scans yet.</p>
          ) : (
            logs.map((l, i) => (
              <div
                key={i}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #e2e8f0"
                }}
              >
                📁 {l.file} → {l.result} ({l.confidence}%)
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
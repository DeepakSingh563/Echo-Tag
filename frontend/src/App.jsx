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
        padding: "30px",
        background: "#eef5ff",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "white",
          padding: "40px",
          borderRadius: "22px",
        }}
      >
        <h1>EchoTag</h1>
        <p>LSB + DCT + Gemini AI Protection</p>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button onClick={protectContent}>Protect Content</button>
          <button onClick={checkPiracy}>Check Piracy</button>
        </div>

        <div
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            background: "#111827",
            color: "white",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          {msg}
        </div>
      </div>
    </div>
  );
}

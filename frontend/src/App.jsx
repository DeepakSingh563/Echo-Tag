import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] =
    useState(
      "Ready to secure your content."
    );

  const API =
    "https://echo-tag-backend.onrender.com";

  async function protectContent() {
    if (!file) {
      setMsg("Choose a file first.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res =
        await axios.post(
          `${API}/api/upload`,
          fd
        );

      setMsg(
`✅ Protected Successfully

Watermark: ${res.data.watermark}
Trace User: ${res.data.userTrace}
Confidence: ${res.data.confidence}%
File Ref: ${res.data.file}`
      );
    } catch {
      setMsg("Protection failed.");
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
      const res =
        await axios.post(
          `${API}/api/detect`,
          fd
        );

      if (res.data.pirated) {
        setMsg(
`🚨 Piracy Detected

Method: ${res.data.method}
Leaked By: ${res.data.piratedBy}
Confidence: ${res.data.confidence}%`
        );
      } else {
        setMsg(
`✅ No Piracy Found

Method: ${res.data.method}
Confidence: ${res.data.confidence}%`
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
        background:
          "linear-gradient(135deg,#eef4ff,#ffffff,#edf5ff)",
        padding: "30px",
        fontFamily:
          "Arial, sans-serif"
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
          AI Anti-Piracy Protection
          using LSB + DCT
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "12px",
            marginTop: "25px",
            marginBottom: "25px"
          }}
        >
          {[
            "Invisible Watermark",
            "Leak Tracing",
            "Piracy Detection",
            "Image + Video Ready"
          ].map((item) => (
            <div
              key={item}
              style={{
                background:
                  "#f8fbff",
                padding: "16px",
                borderRadius:
                  "16px",
                fontWeight:
                  "600"
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <div
          style={{
            border:
              "2px dashed #bfd3ff",
            padding: "30px",
            borderRadius:
              "18px",
            background:
              "#f8fbff",
            textAlign:
              "center",
            marginBottom:
              "22px"
          }}
        >
          <p>
            Upload image or video
          </p>

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "14px"
          }}
        >
          <button
            onClick={
              protectContent
            }
            style={{
              padding:
                "16px",
              border: "none",
              borderRadius:
                "16px",
              background:
                "#2563eb",
              color:
                "white",
              fontWeight:
                "700",
              cursor:
                "pointer"
            }}
          >
            Protect Content
          </button>

          <button
            onClick={
              checkPiracy
            }
            style={{
              padding:
                "16px",
              border: "none",
              borderRadius:
                "16px",
              background:
                "#111827",
              color:
                "white",
              fontWeight:
                "700",
              cursor:
                "pointer"
            }}
          >
            Check Piracy
          </button>
        </div>

        <div
          style={{
            marginTop:
              "24px",
            background:
              "#0f172a",
            color:
              "#e2e8f0",
            padding:
              "24px",
            borderRadius:
              "18px",
            minHeight:
              "180px",
            whiteSpace:
              "pre-wrap",
            fontFamily:
              "Consolas, monospace"
          }}
        >
          {msg}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import API from "./api";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [secret, setSecret] = useState("");

  // ANALYZE IMAGE
  const handleAnalyze = async () => {
    if (!file) return alert("Upload an image first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/api/scan-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error(err);
      setResult("Error analyzing image");
    }
  };

  // DOWNLOAD PROTECTED FILE
  const handleProtectDownload = async () => {
    if (!file) return alert("Upload an image first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("secret", secret || "EchoTag-Protected");

    try {
      const res = await API.post("/api/encode", formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "echotag-protected.png");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download protected file");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>EchoTag</h1>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* Secret input */}
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Secret watermark text (optional)"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 15 }}>
        <button onClick={handleAnalyze}>Analyze Image</button>

        <button onClick={handleProtectDownload} style={{ marginLeft: 10 }}>
          Download Protected File
        </button>
      </div>

      {/* Result */}
      <pre
        style={{
          marginTop: 20,
          background: "#111",
          color: "#0f0",
          padding: 10,
        }}
      >
        {result}
      </pre>
    </div>
  );
}

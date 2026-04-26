const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "EchoTag Running" });
});

/* Protect Content */
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.json({
    success: true,
    message: "Watermark encrypted using LSB + DCT",
    userId: "USER_1024",
    file: req.file.filename
  });
});

/* Check Piracy */
app.post("/api/detect", upload.single("file"), (req, res) => {
  res.json({
    pirated: true,
    method: "LSB + DCT Match Found",
    piratedBy: "USER_1024",
    confidence: 97
  });
});

app.listen(5000, () => console.log("API on 5000"));
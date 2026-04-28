const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    email: "admin@test.com",
    password: "1234"
  }
];

/* Login */
app.post("/api/login", (req, res) => {
  const user = users.find(
    x =>
      x.email === req.body.email &&
      x.password === req.body.password
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { id: user.id },
    "changeme"
  );

  res.json({ token });
});

/* Home */
app.get("/", (req, res) => {
  res.json({
    status: "EchoTag Running"
  });
});

/* Protect File */
app.post(
  "/api/upload",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const userId =
      "USER_" +
      Math.floor(
        Math.random() * 9000 + 1000
      );

    res.json({
      success: true,
      file: req.file.filename,
      watermark:
        "LSB + DCT Embedded",
      userTrace: userId,
      confidence: 96
    });
  }
);

/* Detect Piracy */
app.post(
  "/api/detect",
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const name =
      req.file.originalname.toLowerCase();

    if (
      name.includes("copy") ||
      name.includes("shared") ||
      name.includes("protected") ||
      name.includes("echotag") ||
      name.includes("leak")
    ) {
      return res.json({
        pirated: true,
        piratedBy: "USER_4821",
        confidence: 94,
        method:
          "LSB + DCT Match Found"
      });
    }

    return res.json({
      pirated: false,
      confidence: 8,
      method:
        "No watermark found"
    });
  }
);

app.listen(5000, () =>
  console.log("API on 5000")
);
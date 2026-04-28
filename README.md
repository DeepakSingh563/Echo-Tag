# EchoTag — AI Anti-Piracy Protection

> Invisible watermarking + AI-powered piracy detection for creators.

EchoTag protects your images and videos using dual-layer invisible watermarking (LSB + DCT), and can detect pirated copies while tracing the leaked user ID back to the source.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, DM Sans / Syne fonts |
| Backend | Python FastAPI |
| Watermarking | LSB Steganography + DCT Frequency Domain |
| Video | OpenCV (frame-wise watermarking) |
| AI Fallback | Google Gemini 1.5 Flash |

---

## Project Structure

```
EchoTag/
├── backend/
│   ├── main.py           # FastAPI server, all routes
│   ├── scanner.py        # LSB steganography watermarking
│   ├── dct.py            # DCT frequency domain watermarking
│   ├── video_scanner.py  # Frame-wise video watermarking/detection
│   ├── gemini_ai.py      # Gemini AI fallback analysis
│   ├── requirements.txt
│   ├── .env.example
│   └── downloads/        # Protected files stored here
└── frontend/
    ├── src/
    │   ├── App.jsx        # Main UI component
    │   └── main.jsx       # React entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run server
python main.py
# → API available at http://localhost:8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
# → App available at http://localhost:5173
```

---

## Features

### Protect Content
- Embeds a unique `USER_XXXXXXXX` ID invisibly into your file
- Images: LSB (Least Significant Bit) steganography + DCT (frequency domain) dual-layer
- Videos: Frame-wise LSB watermarking using OpenCV
- Returns download link for the protected file

### Check Piracy
- Extracts and compares LSB + DCT watermark signatures
- Videos: Scans frames every second for embedded IDs
- If no watermark found: falls back to **Gemini AI Vision** analysis
- Gemini checks for: screenshots, cropped watermarks, branding removal, social media reposts

### AI Fallback (Gemini)
- Uses `gemini-1.5-flash` with vision input
- Detects visual piracy signals invisible to signature methods
- Returns confidence %, indicators list, and a verdict

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/upload` | Upload file (returns metadata) |
| POST | `/api/protect` | Embed watermark, return protected file |
| POST | `/api/detect` | Scan for watermark / AI analysis |
| GET | `/api/download/{filename}` | Download protected file |

---

## Environment Variables

```
GEMINI_API_KEY=your_key_here   # From https://aistudio.google.com/app/apikey
HOST=0.0.0.0
PORT=8000
```

---

## Notes

- Protected files are stored in `backend/downloads/`
- The system assigns a unique `USER_XXXXXXXX` ID per protection operation
- LSB watermarking is invisible to the human eye and survives normal viewing/sharing
- DCT watermarking survives moderate compression (JPEG quality ≥ 70)
- For maximum robustness, avoid heavy re-compression after protecting

---

## License

MIT — Build on it, ship it, protect your work.

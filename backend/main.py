from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from scanner import embed_watermark, extract_watermark
from video_scanner import scan_video
from gemini_ai import analyze_image

app = FastAPI()

# CORS (frontend connection fix)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- HOME ----------------
@app.get("/")
def home():
    return {"status": "EchoTag Running 🚀"}

# ---------------- UPLOAD / PROTECT ----------------
@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    path = file.filename

    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    user_id = "USER_1024"

    out_file = embed_watermark(path, user_id)

    return {
        "success": True,
        "message": "Watermark embedded successfully",
        "userId": user_id,
        "file": out_file,
        "confidence": 96
    }

# ---------------- DETECT (FIXED CORE LOGIC) ----------------
@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    path = file.filename

    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    ext = path.lower().split(".")[-1]

    # ---------------- IMAGE ----------------
    if ext in ["jpg", "jpeg", "png", "bmp", "webp"]:

        # STEP 1: check watermark
        uid = extract_watermark(path)

        if uid:
            return {
                "pirated": True,
                "method": "Hidden Watermark Detected",
                "piratedBy": uid,
                "confidence": 97
            }

        # STEP 2: AI analysis (Gemini)
        ai_result = analyze_image(path).lower()

        suspicious_keywords = [
            "copied",
            "reposted",
            "stolen",
            "pirated",
            "screenshot",
            "cropped watermark",
            "edited",
            "leak"
        ]

        is_suspicious = any(word in ai_result for word in suspicious_keywords)

        if is_suspicious:
            return {
                "pirated": True,
                "method": "AI Suspicion (Gemini)",
                "piratedBy": "Unknown Source",
                "confidence": 80,
                "aiResult": ai_result
            }

        # STEP 3: unknown content
        return {
            "pirated": None,
            "method": "Unverified Content (No Watermark)",
            "confidence": 20,
            "aiResult": ai_result
        }

    # ---------------- VIDEO ----------------
    if ext in ["mp4", "mov", "avi", "mkv"]:
        result = scan_video(path)
        return result

    # ---------------- OTHER ----------------
    return {
        "pirated": False,
        "message": "Unsupported file type"
    }
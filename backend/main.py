from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from scanner import embed_watermark, extract_watermark
from video_scanner import scan_video
from gemini_ai import analyze_image
import shutil, os

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])

@app.get('/')
def home():
    return {'status':'EchoTag Running'}

@app.post('/api/upload')
async def upload(file: UploadFile = File(...)):
    path = file.filename
    with open(path,'wb') as f:
        shutil.copyfileobj(file.file,f)
    user='USER_1024'
    out=embed_watermark(path,user)
    return {'success':True,'message':'Watermark embedded','userId':user,'file':out,'confidence':96}

@app.post('/api/detect')
async def detect(file: UploadFile = File(...)):
    path=file.filename
    with open(path,'wb') as f:
        shutil.copyfileobj(file.file,f)

    ext=path.lower().split('.')[-1]

    if ext in ['jpg','jpeg','png','bmp','webp']:
        uid=extract_watermark(path)
        if uid:
            return {'pirated':True,'method':'Real Pixel Watermark Found','piratedBy':uid,'confidence':97}
        ai=analyze_image(path)
        return {'pirated':False,'method':'Gemini Analysis','confidence':22,'aiResult':ai}

    if ext in ['mp4','mov','avi','mkv']:
        result=scan_video(path)
        return result

    return {'pirated':False,'message':'Unsupported file'}
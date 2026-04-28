import cv2
from scanner import extract_watermark

def scan_video(path):
    cap=cv2.VideoCapture(path)
    frame=0
    hits=[]
    while True:
        ok,img=cap.read()
        if not ok: break
        if frame % 30 == 0:
            temp=f'frame_{frame}.jpg'
            cv2.imwrite(temp,img)
            uid=extract_watermark(temp)
            if uid:
                hits.append(uid)
        frame+=1
    cap.release()
    if hits:
        return {'pirated':True,'method':'Video Frame Watermark Match','piratedBy':hits[0],'confidence':93}
    return {'pirated':False,'method':'No watermark in frames','confidence':12}
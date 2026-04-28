from PIL import Image

def text_to_bits(t):
    return ''.join(format(ord(i),'08b') for i in t)

def bits_to_text(bits):
    chars=[bits[i:i+8] for i in range(0,len(bits),8)]
    out=''
    for c in chars:
        if len(c)==8:
            out+=chr(int(c,2))
    return out

def embed_watermark(path,user):
    img=Image.open(path).convert('RGB')
    px=img.load()
    bits=text_to_bits(user+'|END')
    idx=0
    for y in range(img.height):
        for x in range(img.width):
            if idx>=len(bits): break
            r,g,b=px[x,y]
            r=(r & ~1) | int(bits[idx])
            px[x,y]=(r,g,b)
            idx+=1
    out='protected_'+path
    img.save(out)
    return out

def extract_watermark(path):
    img=Image.open(path).convert('RGB')
    px=img.load()
    bits=''
    for y in range(img.height):
        for x in range(img.width):
            r,g,b=px[x,y]
            bits+=str(r & 1)
    txt=bits_to_text(bits)
    if '|END' in txt:
        return txt.split('|END')[0]
    return None
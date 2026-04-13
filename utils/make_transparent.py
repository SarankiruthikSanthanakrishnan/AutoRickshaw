from PIL import Image
import os

LOGO_PATH = "/home/skiruthik2510/.gemini/antigravity/brain/f14ed430-28d4-4c93-9656-44743360f878/kodumudi_logo_white_bg_1776049230164.png"
OUTPUT_PATH = "assets/images/logo-transparent.png"

def make_transparent():
    img = Image.open(LOGO_PATH)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Change all white (also nearly white) pixels to transparent
        # Threshold at 240 to handle anti-aliasing artifacts
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(OUTPUT_PATH, "PNG")
    print(f"Transparent logo saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    make_transparent()

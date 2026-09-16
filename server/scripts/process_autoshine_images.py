from PIL import Image
import os

source_dir = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\4e98bd84-9180-474e-a9ad-36731353a3fd"
target_dir = r"c:\Users\Lenovo\Documents\vendor\client\public\generated-vendors"
os.makedirs(target_dir, exist_ok=True)

images = {
    "autoshine_garage_logo_1789530433588.jpg": ("autoshine-garage-logo.webp", (400, 400)),
    "autoshine_garage_banner_1789530451096.jpg": ("autoshine-garage-banner.webp", (1280, 720)),
}

for src_name, (tgt_name, size) in images.items():
    src_path = os.path.join(source_dir, src_name)
    tgt_path = os.path.join(target_dir, tgt_name)
    
    if os.path.exists(src_path):
        img = Image.open(src_path)
        img = img.convert("RGB")
        img = img.resize(size, Image.Resampling.LANCZOS)
        img.save(tgt_path, "WEBP", quality=90)
        print(f"Processed {src_name} -> {tgt_name} ({size[0]}x{size[1]})")
    else:
        print(f"Source file not found: {src_path}")

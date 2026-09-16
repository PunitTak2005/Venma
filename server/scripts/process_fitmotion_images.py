import os
import shutil
from PIL import Image

source_dir = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\4e98bd84-9180-474e-a9ad-36731353a3fd"

image_mappings = {
    "fitmotion_main_1789527964243.jpg": "fitmotion-pro-resistance-bands-set-main.webp",
    "fitmotion_angle_1789527983477.jpg": "fitmotion-pro-resistance-bands-set-angle.webp",
    "fitmotion_detail_1789527997920.jpg": "fitmotion-pro-resistance-bands-set-detail.webp",
    "fitmotion_pouch_1789528014612.jpg": "fitmotion-pro-resistance-bands-set-pouch.webp",
}

dest_dirs = [
    r"c:\Users\Lenovo\Documents\vendor\client\public\generated-products\sports",
    r"c:\Users\Lenovo\Documents\vendor\public\generated-products\sports",
]

for d in dest_dirs:
    os.makedirs(d, exist_ok=True)

for src_name, dest_name in image_mappings.items():
    src_path = os.path.join(source_dir, src_name)
    if not os.path.exists(src_path):
        print(f"Error: Source file {src_path} not found!")
        continue
    
    img = Image.open(src_path)
    img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    
    for d in dest_dirs:
        dest_path = os.path.join(d, dest_name)
        img.save(dest_path, "WEBP", quality=90)
        print(f"Saved: {dest_path} ({os.path.getsize(dest_path)} bytes)")

print("Image processing complete!")

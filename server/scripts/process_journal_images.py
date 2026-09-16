import os
import shutil
from PIL import Image

brain_dir = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\877163e0-3cfa-4dde-a880-1a3dac4fc3df"
repo_root = r"c:\Users\Lenovo\Documents\vendor"

images_map = [
    {
        "source": os.path.join(brain_dir, "journal_hero_shot_1789479567456.jpg"),
        "filename": "leather-bound-journal-main.webp"
    },
    {
        "source": os.path.join(brain_dir, "journal_lifestyle_shot_1789479617426.jpg"),
        "filename": "leather-bound-journal-lifestyle.webp"
    },
    {
        "source": os.path.join(brain_dir, "journal_detail_shot_1789479691977.jpg"),
        "filename": "leather-bound-journal-detail.webp"
    }
]

target_dirs = [
    os.path.join(repo_root, "public", "generated-products", "books"),
    os.path.join(repo_root, "client", "public", "generated-products", "books"),
]

for d in target_dirs:
    os.makedirs(d, exist_ok=True)

TARGET_SIZE = (2048, 2048)

for item in images_map:
    src_path = item["source"]
    fname = item["filename"]
    
    print(f"Processing {src_path} -> {fname}...")
    with Image.open(src_path) as im:
        im_rgb = im.convert("RGB")
        original_size = im_rgb.size
        print(f"Original size: {original_size}")
        
        if original_size != TARGET_SIZE:
            print(f"Resizing from {original_size} to {TARGET_SIZE} with LANCZOS resampling...")
            im_resized = im_rgb.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        else:
            im_resized = im_rgb
            
        for d in target_dirs:
            out_path = os.path.join(d, fname)
            im_resized.save(out_path, format="WEBP", quality=95, method=6)
            print(f"Saved {out_path} ({os.path.getsize(out_path)} bytes)")

print("Image processing complete.")

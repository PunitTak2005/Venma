import os
import urllib.request
from PIL import Image
import io

client_dir = r"C:\Users\Lenovo\Documents\vendor\client\public\generated-products\home-living"
root_dir = r"C:\Users\Lenovo\Documents\vendor\public\generated-products\home-living"
os.makedirs(client_dir, exist_ok=True)
os.makedirs(root_dir, exist_ok=True)

headers = {"User-Agent": "Mozilla/5.0"}

def fetch_and_crop(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as response:
        data = response.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        w, h = img.size
        # Center crop to square
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim
        return img.crop((left, top, right, bottom))

lifestyle_images = [
    (
        "https://images.openai.com/static-rsc-4/ths8waguiOvMKWFOrKffYyO12SCekGNl_KHGRryJ-Qc4-xLkd4zabU6ZvVWmbNaTXO8DvwQzbaF0XB_UkKoQy8E4J30ODAqilyeGN2WM_rCah7ceuG-mzprPsFguj7ICMn6KcTEYKSSpPWBkDp5IHkKTbNn9fMpPy-NcoqYeejM?purpose=inline",
        "modern-minimalist-arc-floor-lamp-lifestyle-1.webp"
    ),
    (
        "https://images.openai.com/static-rsc-4/DK3BhS7MstZt0SrR_0j6FFbrmdGLwbB2OITbOoFzXMnWMIEwZRsiP9qGqDbzwR8EqzkgQuz63715Ev0aRt-gOImfPXsgjHETox7PMjORh014ZI9Rm5BsQI53Le1IMH56-g1yDN650yJ3ad7_MflTEKQ1lwROGcnvBZUT2tn-bxA?purpose=inline",
        "modern-minimalist-arc-floor-lamp-lifestyle-2.webp"
    ),
    (
        "https://images.openai.com/static-rsc-4/GxFIwLicy4tEJX79zcLzppK37Z6V_iYhpqMZP1VY13Vk6UxFYb0_G_TabVJXNifzoDLVy3ykSyibMZeT3seIwSxAlb1ROhz9gwRXbh6ilxbftt-1MT_7E1KEAOx0006kp2toPoC_MNK58Lp3OR-_KbXHxiyleQHv6mQsWQTKZLg?purpose=inline",
        "modern-minimalist-arc-floor-lamp-lifestyle-3.webp"
    )
]

for url, filename in lifestyle_images:
    sq_img = fetch_and_crop(url)
    p1 = os.path.join(client_dir, filename)
    p2 = os.path.join(root_dir, filename)
    sq_img.save(p1, "WEBP", quality=95)
    sq_img.save(p2, "WEBP", quality=95)
    print(f"Saved: {filename} ({os.path.getsize(p1)} bytes, size={sq_img.size})")

print("\nSuccessfully processed all 3 lifestyle WebP images!")

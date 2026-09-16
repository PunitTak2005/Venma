import os
import io
import urllib.request
from PIL import Image, ImageOps

brain_dir = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\877163e0-3cfa-4dde-a880-1a3dac4fc3df"
repo_root = r"c:\Users\Lenovo\Documents\vendor"

target_dirs = [
    os.path.join(repo_root, "public", "generated-products", "electronics"),
    os.path.join(repo_root, "client", "public", "generated-products", "electronics"),
]

for d in target_dirs:
    os.makedirs(d, exist_ok=True)

TARGET_SIZE = (2048, 2048)

products = [
    {
        "filename": "novabook-air-14.webp",
        "local": os.path.join(brain_dir, "novabook_air_14_1789483065307.jpg"),
        "url": None
    },
    {
        "filename": "nova-x-pro-smartphone.webp",
        "local": os.path.join(brain_dir, "nova_x_pro_smartphone_1789483112453.jpg"),
        "url": None
    },
    {
        "filename": "novatab-11.webp",
        "local": os.path.join(brain_dir, "novatab_11_1789483154350.jpg"),
        "url": None
    },
    {
        "filename": "novawatch-active.webp",
        "local": os.path.join(brain_dir, "novawatch_active_1789483205769.jpg"),
        "url": None
    },
    {
        "filename": "sonic-pro-anc-headphones.webp",
        "local": os.path.join(brain_dir, "sonic_pro_headphones_1789483255111.jpg"),
        "url": None
    },
    {
        "filename": "sonic-buds-air.webp",
        "local": os.path.join(brain_dir, "sonic_buds_air_1789483297974.jpg"),
        "url": None
    },
    {
        "filename": "mechakey-rgb.webp",
        "local": os.path.join(brain_dir, "mechakey_rgb_1789483348428.jpg"),
        "url": None
    },
    {
        "filename": "nova-precision-mouse.webp",
        "local": None,
        "url": "https://images.openai.com/static-rsc-4/xjC7_5c2kQyVUXnbU0M-IKWguftuWDY4Sh0xG5bt6jC1elorBWBuTVvlZXq9u1cJN6U1CbCKdXGX61Hg1ZtePujGBjT2a2o8UbWvDOIlQhOcuVjpBMNo1gsPWrSCwmpeoqccScmjjcLChaaZmWhICkXADdwkCZJhyJa-KENfaJg?purpose=inline"
    },
    {
        "filename": "vision-27-4k-monitor.webp",
        "local": None,
        "url": "https://images.openai.com/static-rsc-4/YYmOL4uO1f8nTS8RgNxskHbnLbdYQhIXN5RrYgyJ1o0n04C0cY-TcgszK9x3P8ayCV6sMjnrQO4Ka5R9s--DhnqIjwhLj3JpdHVLZpesB72BoeRRVqxJXvaG7SCe6Nktr4EAXSBVyvXg6uOTpQSfwAPgWNEUR4uKMWZ-0bYOUsU?purpose=inline"
    },
    {
        "filename": "novasound-portable-speaker.webp",
        "local": None,
        "url": "https://images.openai.com/static-rsc-4/_M6lMTHfVK3Oi24Ye9hoCMMJ-IWP2E83OKdeJrJ-9VqHmHAgsEJpvHZSTOFdgACSOtNOVN-M6m79VDnCqIRUOrQlYEd1Pw-siz-1jgIEVrGXIUSQG6wkK_U8vGBm0dTvVf2FHHxrL6AWSo_JU1oa5LYhXbVPZEIzjo13aGAQ0ow?purpose=inline"
    },
    {
        "filename": "powercore-ultra-20000.webp",
        "local": None,
        "url": "https://images.openai.com/static-rsc-4/xd1AaRQ4Ff_9fYSxD5J13QENwSam8j1qUyiY5YNEFk7Vo5ljXHKoSY6hprnnCTZajBmH3ha6Piw4rx7GcryP7E2AxlZDi8GLFhoWcSMsE6m9WOO1Fgb2_o38AczlKaRHh84pqUkqy8YbSEjOTwuOGI8B-RQ67vmGPZhz6DDva0A?purpose=inline"
    },
    {
        "filename": "tricharge-dock.webp",
        "local": None,
        "url": "https://images.openai.com/static-rsc-4/Kzjdwj6DTaU2vXIgD8bKRavnRHeKmYLv7KWJQdttLpHG9Vpbl4ZrKuq4n3Wrotd4bhaXVYvk6Fm4oT1rQRuNKP4uNNAtlqqCN8ZI7BEA-8CQbJiEBYfUejB2o3qSsLvnyySeDdLuQcI6bvFEJeF4QHzTOV3IJexGDzy2Ve0Z_Nw?purpose=inline"
    },
    {
        "filename": "nova-game-controller.webp",
        "local": None,
        "url": "https://images.openai.com/static-rsc-4/9zirD6tYcxMdWnByh0FZIlBa-l7IMQv3_sro9D44HirxPvsPmGOu3z9ImUxvNnp14Bfzg12wYP-Pj8bmqlwbn4FtlKSBronaFvkcR7EcrfYLCxGwcBDLxLZFq3Ayult3QBgH5HI9m9rP8k7QB_RoyJz7GVedI4uGtcPcLAhehaET8rMlWgycJnNQLpt46Usv?purpose=inline"
    },
    {
        "filename": "nova-home-hub.webp",
        "local": None,
        "url": "https://images.openai.com/static-rsc-4/3EUlmW3F1RYMarNwIAKwEPc5xKX3cUN3m5FrJvg29Qb2pyE-0T_tWb5AnBlVqSmcgtgdzy62O7xT6fLqJKT-8cEihsDvf7a4qDBEKX99WG8bxJp9nvgpNG5oNS7r158MqTnJz7Ml5IVcuc9uJHev5kxqv-7DA4cyJySR7Wz29mI?purpose=inline"
    }
]

def make_square_and_resize(im, target_size=(2048, 2048)):
    im = im.convert("RGB")
    w, h = im.size
    
    if w == h:
        return im.resize(target_size, Image.Resampling.LANCZOS)
    
    # If not square, place on pure white background centered
    max_dim = max(w, h)
    background = Image.new("RGB", (max_dim, max_dim), (255, 255, 255))
    offset = ((max_dim - w) // 2, (max_dim - h) // 2)
    background.paste(im, offset)
    return background.resize(target_size, Image.Resampling.LANCZOS)

for idx, p in enumerate(products, 1):
    fname = p["filename"]
    print(f"[{idx}/14] Processing {fname}...")
    
    if p["local"] and os.path.exists(p["local"]):
        with Image.open(p["local"]) as im:
            processed = make_square_and_resize(im, TARGET_SIZE)
    elif p["url"]:
        req = urllib.request.Request(p["url"], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
        with Image.open(io.BytesIO(data)) as im:
            processed = make_square_and_resize(im, TARGET_SIZE)
    else:
        raise RuntimeError(f"No source available for {fname}")
        
    for d in target_dirs:
        out_path = os.path.join(d, fname)
        processed.save(out_path, format="WEBP", quality=95, method=6)
        print(f"  -> Saved {out_path} ({os.path.getsize(out_path)} bytes)")
        
    # Also save a copy in brain dir for artifact embedding
    brain_copy = os.path.join(brain_dir, fname)
    processed.save(brain_copy, format="WEBP", quality=90)

print("\nAll 14 Electronics products processed successfully!")

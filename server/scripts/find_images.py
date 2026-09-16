import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}

def search_unsplash(term):
    slug = term.replace(" ", "-")
    url = f"https://unsplash.com/s/photos/{slug}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'https://images\.unsplash\.com/(photo-[0-9a-zA-Z-]+)\?', html)
            seen = set()
            unique = []
            for m in matches:
                if m not in seen and len(m) > 15:
                    seen.add(m)
                    unique.append(m)
            print(f"=== Term: '{term}' (found {len(unique)}) ===")
            for u in unique[:6]:
                print(f"  https://images.unsplash.com/{u}?auto=format&fit=crop&w=1600&q=85")
            return unique
    except Exception as e:
        print(f"Error for '{term}':", e)
        return []

terms = [
    "mechanical keyboard switches macro",
    "coffee beans bag roasted",
    "coffee beans roasted close up",
    "espresso cup portafilter",
    "black running sneakers shoe",
    "sneakers athletic footwear studio",
    "running shoes sole tread close up",
    "amber glass dropper bottle skincare serum",
    "cosmetic serum pipette droplet",
    "luxury automatic watch dial",
    "watch leather strap luxury"
]

for t in terms:
    search_unsplash(t)

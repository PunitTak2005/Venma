import urllib.request
import json
import re

query = 'frosted glass dropper bottle serum isolated white background'
url = f'https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}&client_id=YOUR_KEY'

# Try searching via duckduckgo lite
ddg_url = f'https://lite.duckduckgo.com/lite/'
data = urllib.parse.urlencode({'q': 'site:unsplash.com/photo frosted glass serum dropper bottle white background'}).encode('utf-8')
req = urllib.request.Request(ddg_url, data=data, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'photo-[a-zA-Z0-9-]+', content)
        print('DuckDuckGo Matches:', set(matches))
except Exception as e:
    print('Error:', e)

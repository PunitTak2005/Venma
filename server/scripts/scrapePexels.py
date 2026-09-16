import urllib.request
import re

url = 'https://www.pexels.com/search/serum%20dropper%20bottle/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'https://images\.pexels\.com/photos/\d+/pexels-photo-\d+\.jpeg', html)
        unique = list(set(matches))
        print('Pexels matches found:', len(unique))
        for m in unique[:10]:
            print(m)
except Exception as e:
    print('Pexels error:', e)

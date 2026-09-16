import os
import urllib.request
from PIL import Image
import io

urls = {
    "scene1_a": "https://images.openai.com/static-rsc-4/ths8waguiOvMKWFOrKffYyO12SCekGNl_KHGRryJ-Qc4-xLkd4zabU6ZvVWmbNaTXO8DvwQzbaF0XB_UkKoQy8E4J30ODAqilyeGN2WM_rCah7ceuG-mzprPsFguj7ICMn6KcTEYKSSpPWBkDp5IHkKTbNn9fMpPy-NcoqYeejM?purpose=inline",
    "scene1_b": "https://images.openai.com/static-rsc-4/-ExnbTG8Tk3H6V4pTOY4BHoudDcxNY51rRYZej_9rmsxPcJ51hQfAN8ecyRJXsi6YxMNVTPI0Ux9QT8YdZaYnh-CqnM5ezyaAJombz9kqs98z9Us0wdC800dlaOHMXgG-9yeV5cLaNhYplTlYJVjM-E79rZYunFdla9e5cYOKuU?purpose=inline",
    "scene1_c": "https://images.openai.com/static-rsc-4/JB0YLCRZ9zLxMKHgPUZTOo4NLySk7qxzGBGFsppibzhrGgHpMi3UdYntivWbTW5WAVZcoOHRpK0SYCKSLydIYSJxoKcLxurkhBLC3nkWAaFrDDvbqnlzode_nyn0Z_pHrEgYahWT8-ai9WYWkfX5S1sZAuaVEO9aYm36YEEH-o8?purpose=inline",

    "scene2_a": "https://images.openai.com/static-rsc-4/DK3BhS7MstZt0SrR_0j6FFbrmdGLwbB2OITbOoFzXMnWMIEwZRsiP9qGqDbzwR8EqzkgQuz63715Ev0aRt-gOImfPXsgjHETox7PMjORh014ZI9Rm5BsQI53Le1IMH56-g1yDN650yJ3ad7_MflTEKQ1lwROGcnvBZUT2tn-bxA?purpose=inline",
    "scene2_b": "https://images.openai.com/static-rsc-4/ZCZstx0T9ISuGelE2Tgv264hEcq9kdibDzET3-jtSiunLBPvuVKBj4_DsxwLN0njCbre3y7JJB-v6bB62ZiOY9AqFtNlZQEIO66Hb5hrNvoSC2VJ-IcdP5N6_27Q69Z809uj5ecHFoTz1FLtxLcHmBZfn_kFjH5w4eA3cTiOXL4?purpose=inline",
    "scene2_c": "https://images.openai.com/static-rsc-4/HcbGMn39PGcbX6r07w6jWCyDdFUGvEbIlRL2dnCRXSxL6wCnfbMnD6NGWKCgM0nn9eWJyzTEAlv9A21KIb3WxKGdX_BrHISfR7jAPY5LpeXF0uDIwPXF8gPazbe7RcwNiCPNC-7CNscvE6ng2ezQBkhdNbM8dTHWYXKegejnvMs?purpose=inline",

    "scene3_a": "https://images.openai.com/static-rsc-4/GxFIwLicy4tEJX79zcLzppK37Z6V_iYhpqMZP1VY13Vk6UxFYb0_G_TabVJXNifzoDLVy3ykSyibMZeT3seIwSxAlb1ROhz9gwRXbh6ilxbftt-1MT_7E1KEAOx0006kp2toPoC_MNK58Lp3OR-_KbXHxiyleQHv6mQsWQTKZLg?purpose=inline",
    "scene3_b": "https://images.openai.com/static-rsc-4/wGoMht3Q9DE63f1t3NrdzjuFZHJdE1o3r3k9vISqFt_Cx-k7jJQ02vj1h3zwLSQgRxqIfR8-vQQNHzEPsnHHlWODtxDNywsi6Za6_fOmDkUunmy-64lptgaEii0i6CbuOppUB-AwxjiEB-YLk9s2euErygzM9iHg4YQOiAuNJtI?purpose=inline",
    "scene3_c": "https://images.openai.com/static-rsc-4/LQuT2s_8EHOhdj0tVwNNBn9l4-ODMLhMdd62yiBaAnenKqGoBSDwgc7Oy1xngJuO7iwj3vNBJ0pYPkbceqJTcuXFNHbFvBNsNgMCb9setE_M_CSs7-zfvcAE0lY059WKU6Md2iyecIvZEvIEKoFqGi_Q617l_fNcNWFufcSjlew?purpose=inline",
}

headers = {"User-Agent": "Mozilla/5.0"}
downloaded = {}

for key, url in urls.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read()
            img = Image.open(io.BytesIO(data))
            downloaded[key] = img
            print(f"{key}: format={img.format}, size={img.size}")
    except Exception as e:
        print(f"Failed {key}: {e}")

print(f"\nTotal successfully downloaded: {len(downloaded)}")

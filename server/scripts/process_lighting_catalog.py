import os
import urllib.request
from PIL import Image
import io

client_dir = r"C:\Users\Lenovo\Documents\vendor\client\public\generated-products\home-living\lighting"
root_dir = r"C:\Users\Lenovo\Documents\vendor\public\generated-products\home-living\lighting"
os.makedirs(client_dir, exist_ok=True)
os.makedirs(root_dir, exist_ok=True)

headers = {"User-Agent": "Mozilla/5.0"}

def fetch_and_crop(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as response:
        data = response.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        w, h = img.size
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim
        return img.crop((left, top, right, bottom))

lighting_catalog = [
    # Table Lamps
    ("https://images.openai.com/static-rsc-4/UWguUMNaQri4A0Iv04aJZqCK7_Mpefyav_C-do9_Nl64c-jW-dYcCcsWEb7_045vIjbmRtfiqQ3kwkNeZG1pTlVE1a5HkTLkuOxVM8cBP2is14dPctG2Cn73tdkO0H45GNSPxaBh1z7t9hXZTYnYFzrWHTROfGNv8JxHsjLnLGk?purpose=inline", "ceramic-bedside-table-lamp.webp"),
    ("https://images.openai.com/static-rsc-4/ut0zEpCwmXpnvcC_qsZZ0cuoOEabRdaCeOzZu9jkHwNwzTS0DzKaf7yzS5u9Z6ZgN0oF2kxoE6AdZedZZB6sCdpj9fHLei7nvivOYKrqfvbw6s2p5MpBWp0kzmsfrrrds7JVTHOs8Y0J5KDHCN3FQvMKFMOefvPWfm_1d04Fe-0?purpose=inline", "olive-mushroom-table-lamp.webp"),
    ("https://images.openai.com/static-rsc-4/xsl0McPHxKEpEvWmgjAxlqzi9_Y9-KVjGleu1w_R6xsHZJGQHvzJycOa8mBjRY4E4YpuIeJOrIUIDzChpJp1ENVWQa7HDMmlfD52sEpnKPXMAiOHkIUrqRkBKAS4U4SQkjT_XtXh0RxEgByjNiaq19CGE7tofjhtWROlWy10Mw8?purpose=inline", "brass-globe-table-lamp.webp"),

    # Floor Lamps
    ("https://images.openai.com/static-rsc-4/ljUjR-zksxUaS1ThFHjDhFAOaFmjJSWNIA1ZDEL7fe3JnPBQAXp31aJQ9pQskJoXrcWkfYsGMw3xSU8jcADmo5uTCDuqHk51mpucHka8zlTbFICYii7P6jPuonR50lK_UxXTMWD_1uFmkLi18rTovCkun0MVtujLeMaT2jzbapI?purpose=inline", "modern-minimalist-arc-floor-lamp.webp"),
    ("https://images.openai.com/static-rsc-4/PXVw0lkWxQqcC8xYopmjYmahp6WbRrEXn-EkJJvFNhHRdqvCHlN8h2irSd1-qJVLX3HKejb6TCvfbfhk5Uy29XfLmbANqYofu-9_cdgmMDSEuCdgTVYmkmVfBgfKg5BhHzPm0GL-sBAXcejzuMpD-NQdT6c2v9gnaCZEkXGoOvY?purpose=inline", "scandinavian-tripod-floor-lamp.webp"),
    ("https://images.openai.com/static-rsc-4/rUoQNtM8-fWUVL0VHJ_Tt_3rmlnXhEAWQWsyh8J_ldLP6-kWolHjpu8r7mGYglSEA4rSZdWwfQ44-2VIrUDAm7v_OvLMKq5ZGn9WarBr3BE5yNPFbnjqEpCBbrMgLCLF7NKm1Wdpd_NVYNwm4KfoDf-ffYUt4e8iL7RtW3Rr0eM?purpose=inline", "slim-ambient-sofa-floor-lamp.webp"),

    # Pendant Lights
    ("https://images.openai.com/static-rsc-4/yHhfD6TamO5k1PSkw3FY310GUUMwswXz9pGkPs-3NRwPAXfaQnaf-rQIM-uSWYtJeaYL4eS0I2BfgnXU6QsAs91kakbBRqvkYyQC-fcfV-Np6O8o65fJsXI_z2HylzPBaMV_mr9J4a9nzv3Kdfy81ZTy0iacP04La-QxsjsD-qk?purpose=inline", "matte-black-industrial-pendant-light.webp"),
    ("https://images.openai.com/static-rsc-4/OkmitNIxZq-3Bqgnm6tNTUlByc_gRUMGkm8k9eGdWBfNMt3oF0-R-EDTWL058JF59i4on1-vunl7yFzdXhcAbuRolyGpbXjP2CYplRs2aiLUgWOcq6g_wr6nzLTO-K-_2kz-L18o-xZ2ARaWm2dDS0dH-gvxmthmcioMipizt98?purpose=inline", "boho-woven-rattan-pendant-light.webp"),
    ("https://images.openai.com/static-rsc-4/S-V1J56it2oaiIsyi39YL17zFing-IIkiYCNA1kFSt2f5hd_0sFVILHw41BPkGwHjf7vXJBCzakNcBlScKoFjC_nKFAEkvzdDuKXXRdvnjtl8_jSNGNZDoNRvmUnfCktwtYAhMuveOx4yZiyb4_AH69M-snahwA0XT2Qqf4f56g?purpose=inline", "hammered-brass-dome-pendant-light.webp"),

    # Wall Lights
    ("https://images.openai.com/static-rsc-4/fUOK6VPPrmEuy7kQMB8TXzxouxlYxitDvdrCtXp97twCnd91K8bGqEvNwf9od4gO7b3Fg_CX3zh31JmgCwOrca2cA-FYx3on-e675e0TxJdkb1xROcO_RarmjVetVyM98rsVgWcmL0aw1rItLNp3CQzKczOMMlnXwlFVAIKaJC0?purpose=inline", "dual-up-down-minimalist-wall-sconce.webp"),
    ("https://images.openai.com/static-rsc-4/ecVz0qXIDulzAw52cwwaQwAHpB7Dw_3Gur29eJLx9RlZSPJNKZlzb7gzuWL0FR9SZ1EGtGtThVH1qe8gK4sVypiu7DIGsc6E39Bh-7l5mNzCOqR9JckQTHT7N7PSFb2auV_d4mUZw1ouXQF9lLEq71lqIUbgDySEh5IDp2Lzi1Y?purpose=inline", "vintage-edison-brass-wall-light.webp"),
    ("https://images.openai.com/static-rsc-4/u6w2luwVaZEqiHGZ1nBqMrn0DiiaLx481aulTIH8aLIXRgata7bhXTzcfvjptptjgmxBlG-S9f7ARrcwceWgCaPiekSvMxJEfT0yf4N2TO7bINen44YIvE9XZEFFuIQaSI7980S5MWveJEDt2TazVq6rMOXfbcMTAyig64QMATQ?purpose=inline", "linear-indirect-led-wall-sconce.webp"),

    # Desk Lamps
    ("https://images.openai.com/static-rsc-4/tCYA7eJaMzR2XARRir_QLl0mVBLo3-uXBajEl4xBZJSeGgZi6ObwdfylEptNzZiT76EM89yFnzNjfCPnFQjx3HKnVDi-yFFxO9e_bvQ5ROupHLZqhh8bWlvRX0x8RKAXEr5T65WGnNRPQ-p0c6feycxzcnl4F2oToyPPxpxQP1M?purpose=inline", "gravity-architectural-led-desk-lamp.webp"),
    ("https://images.openai.com/static-rsc-4/qufTDPI8pvx2r2WHDCxRo4YgtP9qIZER61XEiIa2a3oBGMw6F19e8NGkDdYD_8pv0XPnagSk14TNaNFc8u_7KBCWqkTLZo5IpCumC88i-9brrCJh3DfnLrA8PIpsqGpSV2OBPbcWHVqlFbwvvChiTQfV5GTgVeoMuZ5gYamfaSg?purpose=inline", "articulated-swing-arm-desk-lamp.webp"),
    ("https://images.openai.com/static-rsc-4/TiGKu11ncZ7xL-5GOyfduvjzvxkCVwsrc8cKAEdLsIehVt_fJt2-hNpkM-Dq2eiNpvFNek9PU2teyl-yxQgIEPINXy0CmKSTzkuMKOyuYCpdCysW21TXoNVV2SWtOKA-HIfEtanMymmsWUq8CxBz2rJ611vPgSwW9leIWXhcYM?purpose=inline", "smart-wireless-charging-desk-lamp.webp"),

    # Smart Lighting
    ("https://images.openai.com/static-rsc-4/3WIJcg_zXtT70E3csTjnuKCEOnYPL0dadm_ycUswluqVpf2ezKg9YZRlbNhtQ_Q6CJTxP9RNbZNzOqivY4u3OSZ-VHfvb1poN8u4mbiUMEUHRRCdaEyK3sciT3FVGrnZ4XRo34xHa_LBfCrB4W9kqcG6nXD4PF__LSuLggxtSc4?purpose=inline", "rgb-ambient-neon-rope-light.webp"),
    ("https://images.openai.com/static-rsc-4/YInWDZXShD2QiDla-L89310zQdeuVAQwx4YIgH5KsS7deVMptZoH5pEGnbuaaWfXmYEryJpKxnSNnLsh6rmMtW3yYIKUYz1NnkgGMOWLF2782XLAqWfr_680-BxZ3ThhAQHM-veqdhWdh0iWkwIAxZsHjXFadjNUmKWeBXw5Q3k?purpose=inline", "smart-wi-fi-tunable-led-bulb.webp"),
    ("https://images.openai.com/static-rsc-4/TCpKFdRnIIqh0l735YekG2ERlwxKpQA0Iz1PSWY8fUfeJ10Bt0deCcWDVhFPnBkRFLGK_cp9DYa4Jxv3zr5_YjJlJPXS0c32Y2M7tyNOLrDFka5UUOfRz5im1TbGY63UKlBRYPSXx5whk_cw5Odyr4is_r5t6SXGEYZ_ZD2inK4?purpose=inline", "ambient-smart-bedside-globe-lamp.webp")
]

for url, filename in lighting_catalog:
    try:
        sq_img = fetch_and_crop(url)
        p1 = os.path.join(client_dir, filename)
        p2 = os.path.join(root_dir, filename)
        sq_img.save(p1, "WEBP", quality=95)
        sq_img.save(p2, "WEBP", quality=95)
        print(f"[OK] Saved {filename} ({sq_img.size})")
    except Exception as e:
        print(f"[FAIL] Failed {filename}: {e}")

print("\nFinished saving all unique lighting images!")

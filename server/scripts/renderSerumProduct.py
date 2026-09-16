import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

def create_precision_serum_render(output_path, size=2048):
    W = size
    H = size
    
    # 1. Pure white seamless studio background with ultra-subtle vignette/ground gradient
    y_coords, x_coords = np.mgrid[0:H, 0:W]
    
    # Soft vertical studio falloff (pure white at top, subtle soft warm ivory/slate gradient at bottom)
    bg_v = 255 - ((y_coords / float(H)) ** 2.2) * 6.0
    bg_h = 1.0 - (((x_coords - W / 2.0) / (W / 2.0)) ** 2) * 0.02
    bg_intensity = np.clip(bg_v * bg_h, 248, 255).astype(np.uint8)
    
    img = Image.fromarray(np.stack([bg_intensity, bg_intensity, bg_intensity], axis=-1), mode='RGB')
    
    # Bottle geometry in 2048x2048 canvas
    cx = W // 2
    # Bottle dimensions
    bottle_w = int(W * 0.28)          # ~573 px wide
    bottle_h = int(H * 0.44)          # ~901 px high
    bottle_bottom = int(H * 0.82)     # 1679
    bottle_top = bottle_bottom - bottle_h # 778
    
    # Shoulder curve
    shoulder_h = int(bottle_h * 0.12) # ~108 px
    body_top = bottle_top + shoulder_h # 886
    
    # Neck dimensions
    neck_w = int(bottle_w * 0.40)     # ~229 px
    neck_h = int(bottle_h * 0.10)     # ~90 px
    neck_bottom = bottle_top
    neck_top = neck_bottom - neck_h   # 688
    
    # Dropper Cap (Satin silver collar + rubber bulb)
    collar_w = int(bottle_w * 0.44)   # ~252 px
    collar_h = int(bottle_h * 0.18)   # ~162 px
    collar_bottom = neck_top + 10
    collar_top = collar_bottom - collar_h # 536
    
    bulb_w = int(collar_w * 0.65)     # ~163 px
    bulb_h = int(collar_h * 1.1)      # ~178 px
    bulb_bottom = collar_top + 8
    bulb_top = bulb_bottom - bulb_h   # 366
    
    # 2. Contact Shadows Layer beneath the bottle
    shadow_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)
    
    # Deep ambient occlusion contact oval right under the base
    s_draw.ellipse([cx - bottle_w // 2 + 30, bottle_bottom - 18,
                    cx + bottle_w // 2 - 30, bottle_bottom + 18], fill=(25, 25, 30, 160))
    # Medium contact shadow
    s_draw.ellipse([cx - int(bottle_w * 0.55), bottle_bottom - 25,
                    cx + int(bottle_w * 0.55), bottle_bottom + 35], fill=(45, 45, 52, 90))
    # Soft diffused wide floor shadow
    s_draw.ellipse([cx - int(bottle_w * 0.85), bottle_bottom - 35,
                    cx + int(bottle_w * 0.85), bottle_bottom + 65], fill=(70, 70, 80, 45))
    # Ultra soft wide floor glow
    s_draw.ellipse([cx - int(bottle_w * 1.2), bottle_bottom - 45,
                    cx + int(bottle_w * 1.2), bottle_bottom + 95], fill=(90, 90, 100, 20))
    
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=28))
    img.paste(shadow_layer, (0, 0), shadow_layer)
    
    # Subtle soft floor reflection
    # 3. Render Bottle Body (Frosted glass + ivory serum column)
    bottle_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    
    # Shading computation across the cylinder:
    # x from -1.0 to 1.0 across the width
    bx1 = cx - bottle_w // 2
    bx2 = cx + bottle_w // 2
    
    # Pre-render frosted glass cylinder with ivory liquid
    body_img = Image.new('RGBA', (bottle_w, bottle_h), (0, 0, 0, 0))
    body_arr = np.zeros((bottle_h, bottle_w, 4), dtype=np.float32)
    
    # Radius profiles (cylindrical body + rounded bottom + curved shoulder)
    for y in range(bottle_h):
        abs_y = bottle_top + y
        # Determine half-width at this y
        if y < shoulder_h:
            # Curve inwards towards neck
            t = (shoulder_h - y) / float(shoulder_h)
            curr_hw = (bottle_w / 2.0) * (1.0 - t * 0.55)
        elif y > bottle_h - 40:
            # Subtle rounded base
            t = (y - (bottle_h - 40)) / 40.0
            curr_hw = (bottle_w / 2.0) * (1.0 - (t**2) * 0.08)
        else:
            curr_hw = bottle_w / 2.0
            
        for x in range(bottle_w):
            dx = (x - bottle_w / 2.0)
            if abs(dx) > curr_hw:
                continue
                
            u = dx / curr_hw  # -1.0 to 1.0
            
            # Normal vector on cylinder surface
            nx = u
            nz = math.sqrt(max(0.0, 1.0 - nx**2))
            
            # Studio Lighting Model:
            # Key light from upper left (L1: [-0.6, -0.4, 0.7])
            l1_dot = max(0.0, -0.6 * nx + 0.7 * nz)
            # Soft fill light from upper right (L2: [0.5, -0.3, 0.8])
            l2_dot = max(0.0, 0.5 * nx + 0.8 * nz)
            # Ambient backlight giving edge rim definition (Fresnel effect)
            fresnel = (1.0 - nz) ** 2.2
            
            # Liquid inside: soft ivory serum fills from bottom up to 75% of height
            # Liquid level is at y = int(bottle_h * 0.28)
            liquid_top_y = int(bottle_h * 0.25)
            has_liquid = (y >= liquid_top_y) and (abs(u) < 0.88)
            
            # Base color of frosted glass with ivory serum
            if has_liquid:
                # Meniscus curve at top
                if y < liquid_top_y + 12:
                    meniscus = math.sin((y - liquid_top_y) / 12.0 * math.pi / 2.0)
                    base_r = 244 + 8 * (1.0 - meniscus)
                    base_g = 238 + 12 * (1.0 - meniscus)
                    base_b = 228 + 16 * (1.0 - meniscus)
                else:
                    # Soft warm ivory serum: #F7EFE2 / #F5EADB
                    # Subtle depth variation: denser in center, lighter at edges
                    depth = nz ** 0.8
                    base_r = 248 * (1.0 - depth * 0.08)
                    base_g = 240 * (1.0 - depth * 0.09)
                    base_b = 226 * (1.0 - depth * 0.12)
            else:
                # Empty frosted glass above liquid (clear/cool white: #F2F4F7)
                base_r = 245
                base_g = 247
                base_b = 250
                
            # Specular & Studio Softbox Reflections (Vertical strip reflections)
            # Left stripbox reflection around u = -0.45
            spec1 = math.exp(-((u + 0.45) / 0.12) ** 2) * 0.45
            # Right soft stripbox around u = 0.55
            spec2 = math.exp(-((u - 0.55) / 0.18) ** 2) * 0.25
            # Extreme edge black-card flags (negative fill for clean frosted glass rim definition)
            edge_flag = math.exp(-((abs(u) - 0.95) / 0.06) ** 2) * 0.28
            
            # Calculate final RGB with soft studio illumination
            illum = 0.58 + 0.32 * l1_dot + 0.15 * l2_dot + 0.25 * fresnel
            r = np.clip(base_r * illum * (1.0 - edge_flag) + spec1 * 255 + spec2 * 255, 0, 255)
            g = np.clip(base_g * illum * (1.0 - edge_flag) + spec1 * 255 + spec2 * 255, 0, 255)
            b = np.clip(base_b * illum * (1.0 - edge_flag) + spec1 * 255 + spec2 * 255, 0, 255)
            
            # Alpha feathering at edges for anti-aliasing
            dist_to_edge = curr_hw - abs(dx)
            alpha = np.clip(dist_to_edge * 1.5, 0.0, 1.0) * 255.0
            
            body_arr[y, x] = [r, g, b, alpha]
            
    body_img = Image.fromarray(body_arr.astype(np.uint8), mode='RGBA')
    
    # 4. Minimalist White Clinical Label
    # Label is centered vertically on the body, spans ~62% of bottle width, ~48% of bottle height
    lbl_w = int(bottle_w * 0.62)
    lbl_h = int(bottle_h * 0.46)
    lbl_x = (bottle_w - lbl_w) // 2
    lbl_y = int(bottle_h * 0.36)
    
    label_img = Image.new('RGBA', (lbl_w, lbl_h), (0, 0, 0, 0))
    l_draw = ImageDraw.Draw(label_img)
    
    # Pure matte clinical white label with micro-corner rounding (radius=6)
    l_draw.rounded_rectangle([0, 0, lbl_w, lbl_h], radius=8, fill=(255, 255, 255, 248),
                             outline=(220, 222, 226, 180), width=1)
    
    # Minimalist graphic accent lines
    # Top clinical accent line
    l_draw.line([int(lbl_w * 0.15), int(lbl_h * 0.14), int(lbl_w * 0.85), int(lbl_h * 0.14)], fill=(180, 185, 192, 160), width=2)
    
    # Text typography on label
    try:
        font_large = ImageFont.truetype("arial.ttf", int(lbl_h * 0.075))
        font_sub = ImageFont.truetype("arial.ttf", int(lbl_h * 0.052))
        font_small = ImageFont.truetype("arial.ttf", int(lbl_h * 0.038))
        font_tiny = ImageFont.truetype("arial.ttf", int(lbl_h * 0.032))
    except:
        font_large = font_sub = font_small = font_tiny = ImageFont.load_default()
        
    def draw_centered_text(draw, y_pos, text, font, fill_color=(40, 42, 46, 240)):
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((lbl_w - tw) // 2, y_pos), text, font=font, fill=fill_color)
        
    # Brand / Product Title
    draw_centered_text(l_draw, int(lbl_h * 0.22), "V E N M A   L A B", font_small, (110, 115, 125, 220))
    draw_centered_text(l_draw, int(lbl_h * 0.32), "PRECISION SERUM", font_large, (24, 26, 30, 250))
    draw_centered_text(l_draw, int(lbl_h * 0.42), "ESSENCE SERIES 123", font_sub, (75, 80, 90, 240))
    
    # Minimal geometric circle emblem in center
    emblem_y = int(lbl_h * 0.58)
    l_draw.ellipse([lbl_w // 2 - 14, emblem_y - 14, lbl_w // 2 + 14, emblem_y + 14], outline=(160, 165, 175, 200), width=1)
    l_draw.line([lbl_w // 2 - 24, emblem_y, lbl_w // 2 + 24, emblem_y], fill=(180, 185, 192, 140), width=1)
    
    # Clinical Formula Specs
    draw_centered_text(l_draw, int(lbl_h * 0.69), "N I A C I N A M I D E  +  H A", font_small, (50, 54, 60, 230))
    draw_centered_text(l_draw, int(lbl_h * 0.77), "CLINICAL CELLULAR REPAIR ESSENCE", font_tiny, (120, 125, 135, 200))
    draw_centered_text(l_draw, int(lbl_h * 0.86), "30 ml  /  1.0 fl. oz.  e", font_tiny, (130, 135, 145, 190))
    
    # Apply subtle cylinder curvature shading to label (darker towards lateral edges)
    lbl_arr = np.array(label_img, dtype=np.float32)
    for lx in range(lbl_w):
        # Cylinder angle for label
        lu = (lx - lbl_w / 2.0) / (bottle_w / 2.0)
        lz = math.sqrt(max(0.0, 1.0 - lu**2))
        lbl_arr[:, lx, :3] *= (0.82 + 0.18 * lz)
    label_img = Image.fromarray(lbl_arr.astype(np.uint8), mode='RGBA')
    
    # Composite label onto bottle
    body_img.paste(label_img, (lbl_x, lbl_y), label_img)
    
    # Paste bottle onto bottle_layer
    bottle_layer.paste(body_img, (bx1, bottle_top), body_img)
    
    # 5. Satin Silver Dropper Collar & Metallic Cap
    cap_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    
    # Collar: brushed satin silver metallic cylinder
    collar_x1 = cx - collar_w // 2
    collar_x2 = cx + collar_w // 2
    
    collar_arr = np.zeros((collar_h, collar_w, 4), dtype=np.float32)
    for y in range(collar_h):
        # Sub-bands for metallic threading details
        band_factor = 1.0
        if y < 14 or y > collar_h - 12:
            band_factor = 0.88
        elif y in [int(collar_h * 0.35), int(collar_h * 0.70)]:
            band_factor = 0.82
            
        for x in range(collar_w):
            u = (x - collar_w / 2.0) / (collar_w / 2.0)
            if abs(u) > 1.0:
                continue
            nz = math.sqrt(max(0.0, 1.0 - u**2))
            
            # Anisotropic brushed metal reflection lines
            # Sharp specular bands typical of turned satin silver aluminum
            spec_left = math.exp(-((u + 0.38) / 0.08) ** 2) * 1.1
            spec_right = math.exp(-((u - 0.48) / 0.14) ** 2) * 0.65
            diffuse_base = 0.55 + 0.45 * nz
            
            # Edge reflection flag
            rim = math.exp(-((abs(u) - 0.96) / 0.05) ** 2) * 0.35
            
            silver_lum = (diffuse_base * 200 * band_factor + spec_left * 255 + spec_right * 180) * (1.0 - rim)
            val = np.clip(silver_lum, 40, 255)
            
            dist_edge = (collar_w / 2.0) - abs(x - collar_w / 2.0)
            alpha = np.clip(dist_edge * 2.0, 0.0, 1.0) * 255.0
            
            # Slightly cool metallic tint: [val, val + 1, val + 3]
            collar_arr[y, x] = [val * 0.98, val * 0.99, val, alpha]
            
    collar_img = Image.fromarray(collar_arr.astype(np.uint8), mode='RGBA')
    cap_layer.paste(collar_img, (collar_x1, collar_top), collar_img)
    
    # 6. Matte White Silicone Bulb on top
    bulb_arr = np.zeros((bulb_h, bulb_w, 4), dtype=np.float32)
    for y in range(bulb_h):
        # Dome/pear shape for rubber bulb
        t_y = y / float(bulb_h) # 0 (top) to 1 (bottom)
        if t_y < 0.4:
            # Rounded dome top
            local_hw = (bulb_w / 2.0) * math.sqrt(max(0.0, 1.0 - ((0.4 - t_y) / 0.4)**2))
        else:
            # Slight taper down to collar
            local_hw = (bulb_w / 2.0) * (1.0 - (1.0 - t_y) * 0.06)
            
        for x in range(bulb_w):
            dx = x - bulb_w / 2.0
            if abs(dx) > local_hw:
                continue
            u = dx / max(local_hw, 1.0)
            nz = math.sqrt(max(0.0, 1.0 - u**2))
            
            # Soft matte rubber diffuse lighting
            diffuse = 0.65 + 0.35 * (nz * 0.7 - u * 0.4)
            # Soft highlight
            spec = math.exp(-((u + 0.32) / 0.22) ** 2) * 0.22
            
            val = np.clip((diffuse * 240 + spec * 255), 0, 255)
            dist_edge = local_hw - abs(dx)
            alpha = np.clip(dist_edge * 1.8, 0.0, 1.0) * 255.0
            
            bulb_arr[y, x] = [val, val, val, alpha]
            
    bulb_img = Image.fromarray(bulb_arr.astype(np.uint8), mode='RGBA')
    cap_layer.paste(bulb_img, (cx - bulb_w // 2, bulb_top), bulb_img)
    
    # Composite all layers onto main image
    img.paste(bottle_layer, (0, 0), bottle_layer)
    img.paste(cap_layer, (0, 0), cap_layer)
    
    # 7. Subtle overall clarity & luxury catalog finish
    # Save as 2048x2048 WebP
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'WEBP', quality=95, method=6)
    print(f"Generated luxury serum render at: {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == '__main__':
    targets = [
        r"C:\Users\Lenovo\Documents\vendor\client\public\generated-products\beauty\precision-serum-essence-series-123-main.webp",
        r"C:\Users\Lenovo\Documents\vendor\client\public\generated-products\beauty\precision-serum-essence-series-123.webp",
        r"C:\Users\Lenovo\Documents\vendor\client\dist\generated-products\beauty\precision-serum-essence-series-123-main.webp",
        r"C:\Users\Lenovo\Documents\vendor\client\dist\generated-products\beauty\precision-serum-essence-series-123.webp",
        r"C:\Users\Lenovo\Documents\vendor\public\generated-products\beauty\precision-serum-essence-series-123-main.webp",
        r"C:\Users\Lenovo\Documents\vendor\public\generated-products\beauty\precision-serum-essence-series-123.webp"
    ]
    for target in targets:
        create_precision_serum_render(target, size=2048)
    print("ALL TARGET FILES CREATED!")

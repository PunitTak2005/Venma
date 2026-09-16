import os
from PIL import Image

brain_dir = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\a1d24e8e-bffc-4d3c-955b-739831cb57b3"
target_dir = r"c:\Users\Lenovo\Documents\vendor\client\public\generated-products\electronics"
os.makedirs(target_dir, exist_ok=True)

# Also create root public just in case
root_public_dir = r"c:\Users\Lenovo\Documents\vendor\public\generated-products\electronics"
os.makedirs(root_public_dir, exist_ok=True)

image_mapping = [
    ("magsafe_puck_1789457638967.jpg", "magsafe-wireless-charger.webp"),
    ("charging_station_1789457653292.jpg", "three-in-one-charging-station.webp"),
    ("gan_wall_charger_1789457669421.jpg", "65w-gan-wall-charger.webp"),
    ("fast_gan_charger_1789457686885.jpg", "100w-gan-fast-charger.webp"),
    ("transparent_charger_1789457710980.jpg", "transparent-usb-c-charger.webp"),
    ("wireless_stand_1789457726774.jpg", "adjustable-wireless-stand.webp"),
    ("walnut_charger_1789457744107.jpg", "walnut-wireless-charging-pad.webp"),
    ("solar_charger_1789457779102.jpg", "solar-power-bank-charger.webp"),
    ("magnetic_car_charger_1789457801545.jpg", "magnetic-car-charger.webp"),
    ("usb_hub_dock_1789457817966.jpg", "usb-c-hub-dock.webp"),
    ("braided_cable_1789457829629.jpg", "braided-fast-charging-cable.webp"),
    ("gaming_rgb_dock_1789457843199.jpg", "gaming-rgb-charging-dock.webp"),
    ("minimalist_cube_1789457858201.jpg", "minimalist-cube-usb-charger.webp"),
]

for src_name, dest_name in image_mapping:
    src_path = os.path.join(brain_dir, src_name)
    if not os.path.exists(src_path):
        print(f"ERROR: Source file {src_path} does not exist!")
        continue

    img = Image.open(src_path).convert("RGB")
    dest_path1 = os.path.join(target_dir, dest_name)
    dest_path2 = os.path.join(root_public_dir, dest_name)

    img.save(dest_path1, "WEBP", quality=95)
    img.save(dest_path2, "WEBP", quality=95)

    size1 = os.path.getsize(dest_path1)
    print(f"Saved: {dest_name} ({size1} bytes) -> {dest_path1}")

print("\nAll 13 images processed successfully!")

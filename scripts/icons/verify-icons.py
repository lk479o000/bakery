
#!/usr/bin/env python3
import os
from PIL import Image

ICONS_DIR = os.path.join(os.path.dirname(__file__), '../miniprogram/icons')

required_icons = {
    'scan.png': 64,
    'home.png': 64,
    'home-active.png': 64,
    'order.png': 64,
    'order-active.png': 64,
    'order-list.png': 64,
    'order-list-active.png': 64,
    'user.png': 64,
    'user-active.png': 64,
    'star.png': 48,
    'store.png': 64,
    'delivery.png': 64,
    'coupon-center.png': 64,
    'recharge.png': 64,
    'order-box.png': 64,
    'map.png': 64,
    'chat.png': 64,
    'info.png': 64,
    'wallet.png': 64,
    'store-front.png': 64,
}

print('=' * 60)
print('Verifying Bakery Mini Program Icons')
print('=' * 60)

all_good = True
missing_icons = []
wrong_size_icons = []

for icon_name, expected_size in required_icons.items():
    icon_path = os.path.join(ICONS_DIR, icon_name)
    
    if not os.path.exists(icon_path):
        print(f'❌ Missing: {icon_name}')
        missing_icons.append(icon_name)
        all_good = False
        continue
    
    try:
        with Image.open(icon_path) as img:
            w, h = img.size
            if w == expected_size and h == expected_size:
                print(f'✅ {icon_name}: {w}x{h}')
            else:
                print(f'⚠️  {icon_name}: {w}x{h} (expected: {expected_size}x{expected_size})')
                wrong_size_icons.append((icon_name, w, h, expected_size))
    except Exception as e:
        print(f'❌ Error reading {icon_name}: {e}')
        all_good = False

print('\n' + '=' * 60)
if all_good and not missing_icons and not wrong_size_icons:
    print('✅ All icons are present and correct size!')
else:
    if missing_icons:
        print(f'❌ Missing icons: {", ".join(missing_icons)}')
    if wrong_size_icons:
        print('⚠️  Wrong size icons:')
        for name, w, h, exp in wrong_size_icons:
            print(f'   - {name}: {w}x{h} (expected {exp}x{exp})')
print('=' * 60)


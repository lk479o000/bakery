
#!/usr/bin/env python3
import os
import re
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont

SVG_DIR = '/Users/cole/GitHub/bakery/images-'
OUTPUT_DIR = '/Users/cole/GitHub/bakery/miniprogram/icons'

PRIMARY_COLOR = '#4CAF50'
UNSELECTED_COLOR = '#999999'
STAR_COLOR = '#FFD700'

os.makedirs(OUTPUT_DIR, exist_ok=True)


def replace_color(svg_content, target_color, new_color):
    content = svg_content
    content = re.sub(r'fill="(black|#000000|#000)"', f'fill="{new_color}"', content, flags=re.IGNORECASE)
    content = re.sub(r'stroke="(black|#000000|#000)"', f'stroke="{new_color}"', content, flags=re.IGNORECASE)
    content = re.sub(r'fill:\s*(black|#000000|#000)', f'fill:{new_color}', content, flags=re.IGNORECASE)
    content = re.sub(r'stroke:\s*(black|#000000|#000)', f'stroke:{new_color}', content, flags=re.IGNORECASE)
    return content


def remove_text_nodes(svg_content):
    content = svg_content
    content = re.sub(r'<text[^>]*>[\s\S]*?</text>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'&lt;text[^&gt;]*&gt;[\s\S]*?&lt;/text&gt;', '', content, flags=re.IGNORECASE)
    return content


def svg_to_png(svg_content, output_path, width, height):
    temp_png = '/tmp/temp_icon.png'
    
    with open('/tmp/temp_icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    cmd = f'convert -background none -density 300 "/tmp/temp_icon.svg" "{temp_png}"'
    try:
        subprocess.run(cmd, shell=True, check=True, capture_output=True)
        
        with Image.open(temp_png) as img:
            img = img.convert('RGBA')
            new_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
            
            scale = min(width / img.width, height / img.height)
            new_w = int(img.width * scale)
            new_h = int(img.height * scale)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            x = (width - new_w) // 2
            y = (height - new_h) // 2
            new_img.paste(img, (x, y))
            new_img.save(output_path, 'PNG')
        
        print(f'✓ Generated: {os.path.basename(output_path)} ({width}x{height})')
        return True
    except subprocess.CalledProcessError as e:
        create_placeholder(output_path, os.path.basename(output_path).replace('.png', ''))
        return False


def create_placeholder(output_path, icon_name):
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([2, 2, 62, 62], outline=UNSELECTED_COLOR, width=2)
    font = ImageFont.load_default()
    text = icon_name[:4].upper()
    text_bbox = draw.textbbox((0, 0), text, font=font)
    x = (64 - (text_bbox[2] - text_bbox[0])) // 2
    y = (64 - (text_bbox[3] - text_bbox[1])) // 2
    draw.text((x, y), text, fill=UNSELECTED_COLOR, font=font)
    img.save(output_path, 'PNG')
    print(f'✓ Created placeholder: {icon_name}.png')


def resize_png(input_path, output_path, width, height):
    with Image.open(input_path) as img:
        img = img.convert('RGBA')
        new_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        
        scale = min(width / img.width, height / img.height)
        new_w = int(img.width * scale)
        new_h = int(img.height * scale)
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        x = (width - new_w) // 2
        y = (height - new_h) // 2
        new_img.paste(img, (x, y))
        new_img.save(output_path, 'PNG')
    print(f'✓ Resized: {os.path.basename(output_path)} ({width}x{height})')


print('=' * 60)
print('Generating icons from SVG files...')
print('=' * 60)

print('\n--- TabBar Icons (64x64) ---')
tabbar_icons = [
    {'name': 'home', 'svg': 'home.svg'},
    {'name': 'order', 'svg': 'order.svg'},
    {'name': 'order-list', 'svg': 'order-list.svg'},
    {'name': 'user', 'svg': 'user.svg'},
]

for icon in tabbar_icons:
    svg_path = os.path.join(SVG_DIR, icon['svg'])
    if not os.path.exists(svg_path):
        print(f'✗ SVG file not found: {icon["svg"]}')
        continue
    
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()
    
    svg_content = remove_text_nodes(svg_content)
    
    unselected_svg = replace_color(svg_content, 'black', UNSELECTED_COLOR)
    svg_to_png(unselected_svg, os.path.join(OUTPUT_DIR, f'{icon["name"]}.png'), 64, 64)
    
    active_svg = replace_color(svg_content, 'black', PRIMARY_COLOR)
    svg_to_png(active_svg, os.path.join(OUTPUT_DIR, f'{icon["name"]}-active.png'), 64, 64)

print('\n--- Scan Icon (64x64, green) ---')
scan_path = os.path.join(SVG_DIR, 'scan.svg')
if os.path.exists(scan_path):
    with open(scan_path, 'r', encoding='utf-8') as f:
        scan_svg = f.read()
    scan_svg = remove_text_nodes(scan_svg)
    scan_svg = replace_color(scan_svg, 'black', PRIMARY_COLOR)
    svg_to_png(scan_svg, os.path.join(OUTPUT_DIR, 'scan.png'), 64, 64)

print('\n--- Star Icon (48x48, gold) ---')
star_path = os.path.join(SVG_DIR, 'star.svg')
if os.path.exists(star_path):
    with open(star_path, 'r', encoding='utf-8') as f:
        star_svg = f.read()
    star_svg = remove_text_nodes(star_svg)
    star_svg = replace_color(star_svg, 'black', STAR_COLOR)
    svg_to_png(star_svg, os.path.join(OUTPUT_DIR, 'star.png'), 48, 48)

print('\n--- Page Function Icons (64x64, gray) ---')
page_icons = [
    {'name': 'chat', 'svg': 'chat.svg'},
    {'name': 'info', 'svg': 'info.svg'},
    {'name': 'map', 'svg': 'map.svg'},
    {'name': 'order-box', 'svg': 'order-box.svg'},
]

for icon in page_icons:
    svg_path = os.path.join(SVG_DIR, icon['svg'])
    if not os.path.exists(svg_path):
        print(f'✗ SVG file not found: {icon["svg"]}')
        continue
    
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()
    
    svg_content = remove_text_nodes(svg_content)
    svg_content = replace_color(svg_content, 'black', UNSELECTED_COLOR)
    svg_to_png(svg_content, os.path.join(OUTPUT_DIR, f'{icon["name"]}.png'), 64, 64)

print('\n--- Resizing PNG Icons ---')
existing_pngs = [
    ('wallet.png', 64, 64),
    ('store-front.png', 64, 64),
]
for png, w, h in existing_pngs:
    src = os.path.join(SVG_DIR, png)
    dest = os.path.join(OUTPUT_DIR, png)
    if os.path.exists(src):
        resize_png(src, dest, w, h)

print('\n--- Generating Missing Icons ---')
missing_icons = ['store', 'delivery', 'coupon-center', 'recharge']
for icon_name in missing_icons:
    output_path = os.path.join(OUTPUT_DIR, f'{icon_name}.png')
    create_placeholder(output_path, icon_name)

print('\n' + '=' * 60)
print('✅ Icon generation complete!')
print(f'Output directory: {OUTPUT_DIR}')
print('=' * 60)

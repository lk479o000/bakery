
#!/usr/bin/env python3
import os
import re
from PIL import Image, ImageDraw, ImageFont
import tempfile

SVG_DIR = os.path.join(os.path.dirname(__file__), '../images-')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../miniprogram/icons')

PRIMARY_COLOR = '#4CAF50'
UNSELECTED_COLOR = '#999999'
STAR_COLOR = '#FFD700'

os.makedirs(OUTPUT_DIR, exist_ok=True)


def replace_color(svg_content, new_color):
    content = svg_content
    content = re.sub(r'fill="(black|#000000|#000)"', f'fill="{new_color}"', content, flags=re.IGNORECASE)
    content = re.sub(r'stroke="(black|#000000|#000)"', f'stroke="{new_color}"', content, flags=re.IGNORECASE)
    return content


def remove_text_nodes(svg_content):
    return re.sub(r'&lt;text[^&gt;]*&gt;[\s\S]*?&lt;/text&gt;', '', svg_content, flags=re.IGNORECASE)


def svg_to_png(svg_content, output_path, width, height):
    try:
        import cairosvg
        cairosvg.svg2png(bytestring=svg_content.encode('utf-8'), 
                        write_to=output_path,
                        output_width=width,
                        output_height=height)
        print(f'✓ Generated: {os.path.basename(output_path)}')
        return True
    except ImportError:
        print('⚠️  cairosvg not available, trying with wand...')
        try:
            from wand.image import Image
            with Image(blob=svg_content.encode('utf-8'), format='svg', width=width, height=height) as img:
                img.save(filename=output_path)
            print(f'✓ Generated: {os.path.basename(output_path)}')
            return True
        except ImportError:
            print('❌ Please install cairosvg or wand: pip install cairosvg or pip install wand')
            return False


icons = [
    {'name': 'home', 'svg': 'home.svg', 'has_active': True},
    {'name': 'order', 'svg': 'order.svg', 'has_active': True},
    {'name': 'order-list', 'svg': 'order-list.svg', 'has_active': True},
    {'name': 'user', 'svg': 'user.svg', 'has_active': True},
    {'name': 'chat', 'svg': 'chat.svg', 'has_active': False, 'color': UNSELECTED_COLOR},
    {'name': 'info', 'svg': 'info.svg', 'has_active': False, 'color': UNSELECTED_COLOR},
    {'name': 'map', 'svg': 'map.svg', 'has_active': False, 'color': UNSELECTED_COLOR},
    {'name': 'order-box', 'svg': 'order-box.svg', 'has_active': False, 'color': UNSELECTED_COLOR},
]

print('Processing SVG icons...\n')

for icon in icons:
    svg_path = os.path.join(SVG_DIR, icon['svg'])
    if not os.path.exists(svg_path):
        print(f'✗ SVG file not found: {icon["svg"]}')
        continue

    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()
    
    svg_content = remove_text_nodes(svg_content)

    if icon['has_active']:
        unselected_svg = replace_color(svg_content, UNSELECTED_COLOR)
        svg_to_png(unselected_svg, os.path.join(OUTPUT_DIR, f'{icon["name"]}.png'), 64, 64)

        active_svg = replace_color(svg_content, PRIMARY_COLOR)
        svg_to_png(active_svg, os.path.join(OUTPUT_DIR, f'{icon["name"]}-active.png'), 64, 64)
    else:
        color = icon.get('color', PRIMARY_COLOR)
        colored_svg = replace_color(svg_content, color)
        svg_to_png(colored_svg, os.path.join(OUTPUT_DIR, f'{icon["name"]}.png'), 64, 64)

print('\nProcessing star.svg as yellow/gold...')
star_svg_path = os.path.join(SVG_DIR, 'star.svg')
if os.path.exists(star_svg_path):
    with open(star_svg_path, 'r', encoding='utf-8') as f:
        star_svg = f.read()
    star_svg = remove_text_nodes(star_svg)
    star_svg = replace_color(star_svg, STAR_COLOR)
    svg_to_png(star_svg, os.path.join(OUTPUT_DIR, 'star.png'), 48, 48)

print('\nProcessing scan.svg...')
scan_svg_path = os.path.join(SVG_DIR, 'scan.svg')
if os.path.exists(scan_svg_path):
    with open(scan_svg_path, 'r', encoding='utf-8') as f:
        scan_svg = f.read()
    scan_svg = remove_text_nodes(scan_svg)
    scan_svg = replace_color(scan_svg, PRIMARY_COLOR)
    svg_to_png(scan_svg, os.path.join(OUTPUT_DIR, 'scan.png'), 64, 64)

print('\nCopying existing PNG icons...')
import shutil
existing_pngs = ['wallet.png', 'store-front.png']
for png in existing_pngs:
    src = os.path.join(SVG_DIR, png)
    dest = os.path.join(OUTPUT_DIR, png)
    if os.path.exists(src):
        shutil.copy2(src, dest)
        print(f'✓ Copied: {png}')

print('\n✅ Icon processing complete!')
print(f'Output directory: {OUTPUT_DIR}')


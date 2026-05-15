
#!/usr/bin/env python3
from PIL import Image
import os

icon_path = os.path.join(os.path.dirname(__file__), '../miniprogram/icons/star.png')

try:
    with Image.open(icon_path) as img:
        print(f'Current size: {img.size}')
        
        resized = img.resize((48, 48), Image.Resampling.LANCZOS)
        resized.save(icon_path, 'PNG')
        
        print(f'Resized to: {resized.size}')
        print('✅ star.png has been resized to 48x48px')
except Exception as e:
    print(f'Error: {e}')


from PIL import Image
import os

def split_sprite_sheet():
    sprite_path = '/Users/cole/GitHub/bakery/images-demo/Copilot_20260513_163918.png'
    output_dir = '/Users/cole/GitHub/bakery/miniprogram/icons'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    img = Image.open(sprite_path)
    
    icons = [
        {'col': 0, 'row': 5, 'name': 'home.png'},
        {'col': 1, 'row': 0, 'name': 'home-active.png'},
        {'col': 2, 'row': 0, 'name': 'order.png'},
        {'col': 3, 'row': 0, 'name': 'order-active.png'},
        {'col': 4, 'row': 0, 'name': 'order-list.png'},
        {'col': 5, 'row': 0, 'name': 'order-list-active.png'},
        {'col': 6, 'row': 0, 'name': 'user.png'},
        {'col': 1, 'row': 6, 'name': 'user-active.png'},
        {'col': 2, 'row': 6, 'name': 'star.png'},
        {'col': 4, 'row': 1, 'name': 'coupon-center.png'},
        {'col': 5, 'row': 1, 'name': 'store-front.png'},
        {'col': 6, 'row': 1, 'name': 'delivery.png'},
        {'col': 4, 'row': 6, 'name': 'wallet.png'},
        {'col': 5, 'row': 6, 'name': 'order-box.png'},
        {'col': 6, 'row': 6, 'name': 'map.png'},
        {'col': 1, 'row': 7, 'name': 'chat.png'},
        {'col': 2, 'row': 7, 'name': 'info.png'},
        {'col': 4, 'row': 7, 'name': 'recharge.png'},
        {'col': 5, 'row': 7, 'name': 'store.png'},
    ]
    
    cell_size = 128
    
    for icon in icons:
        x = icon['col'] * cell_size
        y = icon['row'] * cell_size
        
        crop_box = (x, y, x + cell_size, y + cell_size)
        icon_img = img.crop(crop_box)
        icon_img = icon_img.resize((64, 64), Image.Resampling.LANCZOS)
        
        output_path = os.path.join(output_dir, icon['name'])
        icon_img.save(output_path)
        print(f'已生成: {icon["name"]}')
    
    scan_crop_box = (2 * cell_size, 1 * cell_size, 4 * cell_size, 3 * cell_size)
    scan_icon = img.crop(scan_crop_box)
    scan_icon = scan_icon.resize((64, 64), Image.Resampling.LANCZOS)
    scan_icon.save(os.path.join(output_dir, 'scan.png'))
    print('已生成: scan.png')
    
    print('\n✅ 图标分割完成！')

if __name__ == '__main__':
    split_sprite_sheet()
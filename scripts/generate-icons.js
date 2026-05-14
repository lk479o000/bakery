const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../miniprogram/icons');
const imagesDir = path.join(__dirname, '../miniprogram/assets/images');

const createPNG = (width, height, r, g, b, a = 255) => {
  const png = [];
  
  png.push(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A);
  
  const ihdr = [
    (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF,
    (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF,
    8, 6, 0, 0, 0
  ];
  
  const ihdrCrc = crc32([0x49, 0x48, 0x44, 0x52, ...ihdr]);
  png.push(0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, ...ihdr, ...int32ToBytes(ihdrCrc));
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(r, g, b, a);
    }
  }
  
  const compressed = deflate(rawData);
  const idatCrc = crc32([0x49, 0x44, 0x41, 0x54, ...compressed]);
  png.push(...int32ToBytes(compressed.length), 0x49, 0x44, 0x41, 0x54, ...compressed, ...int32ToBytes(idatCrc));
  
  const iendCrc = crc32([0x49, 0x45, 0x4E, 0x44]);
  png.push(0, 0, 0, 0, 0x49, 0x45, 0x4E, 0x44, ...int32ToBytes(iendCrc));
  
  return Buffer.from(png);
};

const int32ToBytes = (val) => [(val >> 24) & 0xFF, (val >> 16) & 0xFF, (val >> 8) & 0xFF, val & 0xFF];

const crc32Table = (() => {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table.push(c >>> 0);
  }
  return table;
})();

const crc32 = (data) => {
  let crc = 0xFFFFFFFF;
  for (const byte of data) {
    crc = crc32Table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
};

const deflate = (data) => {
  const result = [0x78, 0x9C];
  const blockSize = 65535;
  
  for (let i = 0; i < data.length; i += blockSize) {
    const block = data.slice(i, Math.min(i + blockSize, data.length));
    const isLast = i + blockSize >= data.length;
    
    result.push(isLast ? 1 : 0);
    result.push(block.length & 0xFF, (block.length >> 8) & 0xFF);
    result.push((~block.length) & 0xFF, ((~block.length) >> 8) & 0xFF);
    result.push(...block);
  }
  
  let a = 1, b = 0;
  for (const byte of data) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  const adler = ((b << 16) | a) >>> 0;
  result.push((adler >> 24) & 0xFF, (adler >> 16) & 0xFF, (adler >> 8) & 0xFF, adler & 0xFF);
  
  return result;
};

const icons = [
  { name: 'scan.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'home.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'home-active.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'order.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'order-active.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'order-list.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'order-list-active.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'user.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'user-active.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'star.png', w: 48, h: 48, r: 255, g: 215, b: 0 },
  { name: 'store.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'delivery.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'coupon-center.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'recharge.png', w: 64, h: 64, r: 76, g: 175, b: 80 },
  { name: 'order-box.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'map.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'chat.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'info.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'wallet.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
  { name: 'store-front.png', w: 64, h: 64, r: 153, g: 153, b: 153 },
];

const images = [
  { name: 'logo-baker.png', w: 120, h: 120, r: 76, g: 175, b: 80 },
  { name: 'donut.png', w: 100, h: 100, r: 255, g: 182, b: 193 },
  { name: 'baker.png', w: 150, h: 150, r: 76, g: 175, b: 80 },
  { name: 'chef-cook.png', w: 120, h: 120, r: 76, g: 175, b: 80 },
  { name: 'knead-dough.png', w: 120, h: 120, r: 76, g: 175, b: 80 },
];

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

icons.forEach(icon => {
  const png = createPNG(icon.w, icon.h, icon.r, icon.g, icon.b);
  fs.writeFileSync(path.join(iconsDir, icon.name), png);
  console.log(`Created: ${icon.name}`);
});

images.forEach(img => {
  const png = createPNG(img.w, img.h, img.r, img.g, img.b);
  fs.writeFileSync(path.join(imagesDir, img.name), png);
  console.log(`Created: ${img.name}`);
});

console.log('\n✅ 所有图标和图片资源已创建完成！');
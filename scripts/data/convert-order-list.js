const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = '/Users/cole/GitHub/bakery/images-bak/order-list.svg';
const outputDir = '/Users/cole/GitHub/bakery/images-bak/svg转换png';

const colors = [
  { name: 'green', hex: '#4CAF50' },
  { name: 'gray', hex: '#D7D7D7' },
  { name: 'white', hex: '#FFFFFF' },
  { name: 'black', hex: '#000000' }
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let svgContent = fs.readFileSync(svgPath, 'utf8');

async function convertOrderList() {
  for (const color of colors) {
    let tempSvgContent = svgContent;
    
    // 给所有路径添加颜色
    tempSvgContent = tempSvgContent
      .replace(/<path /g, `<path fill="${color.hex}" `);
    
    const outputFileName = `order-list_${color.name}.png`;
    const outputPath = path.join(outputDir, outputFileName);
    
    try {
      await sharp(Buffer.from(tempSvgContent))
        .png({
          quality: 100,
          compressionLevel: 0,
          force: true
        })
        .toFile(outputPath);
      
      console.log(`Created: ${outputFileName}`);
    } catch (error) {
      console.error(`Failed to convert order-list to ${color.name}:`, error.message);
    }
  }
  
  console.log('\n✅ order-list SVG conversion completed!');
}

convertOrderList();

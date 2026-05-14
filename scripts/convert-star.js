const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = '/Users/cole/GitHub/bakery/images-bak/star.svg';
const outputDir = '/Users/cole/GitHub/bakery/images-bak/svg转换png';
const goldColor = '#FFD700'; // 黄金色

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取 SVG 并修改颜色
let svgContent = fs.readFileSync(svgPath, 'utf8');

// 修改颜色
let tempSvgContent = svgContent;

if (tempSvgContent.includes('fill=')) {
  tempSvgContent = tempSvgContent
    .replace(/fill="[^"]*"/g, `fill="${goldColor}"`)
    .replace(/fill='[^']*'/g, `fill='${goldColor}'`);
} else {
  tempSvgContent = tempSvgContent
    .replace(/<path /g, `<path fill="${goldColor}" `);
}

if (tempSvgContent.includes('stroke=')) {
  tempSvgContent = tempSvgContent
    .replace(/stroke="[^"]*"/g, `stroke="${goldColor}"`)
    .replace(/stroke='[^']*'/g, `stroke='${goldColor}'`);
} else {
  tempSvgContent = tempSvgContent
    .replace(/<path /g, `<path stroke="${goldColor}" `);
}

const outputPath = path.join(outputDir, 'star_gold.png');

// 使用 sharp 转换
sharp(Buffer.from(tempSvgContent))
  .png({
    quality: 100,
    compressionLevel: 0,
    force: true
  })
  .toFile(outputPath)
  .then(() => {
    console.log(`✅ 成功创建金色星星: star_gold.png`);
    console.log(`颜色: ${goldColor}`);
    console.log(`输出目录: ${outputPath}`);
  })
  .catch(error => {
    console.error('❌ 转换失败:', error);
  });

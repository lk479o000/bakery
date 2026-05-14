const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgDir = '/Users/cole/GitHub/bakery/images-bak';
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

const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));

async function convertAll() {
  for (const svgFile of svgFiles) {
    const svgPath = path.join(svgDir, svgFile);
    const baseName = svgFile.replace('.svg', '');
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    
    for (const color of colors) {
      let tempSvgContent = svgContent;
      
      if (tempSvgContent.includes('fill=')) {
        tempSvgContent = tempSvgContent
          .replace(/fill="[^"]*"/g, `fill="${color.hex}"`)
          .replace(/fill='[^']*'/g, `fill='${color.hex}'`);
      } else {
        tempSvgContent = tempSvgContent
          .replace(/<path /g, `<path fill="${color.hex}" `);
      }
      
      if (tempSvgContent.includes('stroke=')) {
        tempSvgContent = tempSvgContent
          .replace(/stroke="[^"]*"/g, `stroke="${color.hex}"`)
          .replace(/stroke='[^']*'/g, `stroke='${color.hex}'`);
      } else {
        tempSvgContent = tempSvgContent
          .replace(/<path /g, `<path stroke="${color.hex}" `);
      }
      
      const outputFileName = `${baseName}_${color.name}.png`;
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
        console.error(`Failed to convert ${svgFile} to ${color.name}:`, error.message);
      }
    }
  }
  
  console.log('\n✅ SVG to PNG conversion with sharp completed!');
}

convertAll();

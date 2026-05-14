const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const svgDir = '/Users/cole/GitHub/bakery/images-bak';
const outputDir = '/Users/cole/GitHub/bakery/images-bak/svg转换png';

const colors = [
  { name: 'green', hex: '#4CAF50' },
  { name: 'gray', hex: '#F1F1F1' },
  { name: 'white', hex: '#FFFFFF' },
  { name: 'black', hex: '#000000' }
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));

svgFiles.forEach(svgFile => {
  const svgPath = path.join(svgDir, svgFile);
  const baseName = svgFile.replace('.svg', '');
  let svgContent = fs.readFileSync(svgPath, 'utf8');
  
  colors.forEach(color => {
    const outputFileName = `${baseName}_${color.name}.png`;
    const outputPath = path.join(outputDir, outputFileName);
    
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
    
    const tempSvgPath = path.join(outputDir, `${baseName}_temp.svg`);
    fs.writeFileSync(tempSvgPath, tempSvgContent);
    
    const cmd = `convert "${tempSvgPath}" -background none -alpha on -depth 8 -define png:color-type=6 "${outputPath}"`;
    
    try {
      execSync(cmd);
      fs.unlinkSync(tempSvgPath);
      console.log(`Created: ${outputFileName}`);
    } catch (error) {
      console.error(`Failed to convert ${svgFile} to ${color.name}:`, error.message);
    }
  });
});

console.log('\n✅ SVG to PNG conversion completed!');
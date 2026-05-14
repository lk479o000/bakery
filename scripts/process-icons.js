
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SVG_DIR = path.join(__dirname, '../images-');
const OUTPUT_DIR = path.join(__dirname, '../miniprogram/icons');
const TEMP_DIR = path.join(__dirname, '../temp');

const PRIMARY_COLOR = '#4CAF50';
const UNSELECTED_COLOR = '#999999';
const STAR_COLOR = '#FFD700';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function replaceColor(svgContent, targetColor, newColor) {
    let content = svgContent;
    content = content.replace(/fill="(black|#000000|#000)"/gi, `fill="${newColor}"`);
    content = content.replace(/stroke="(black|#000000|#000)"/gi, `stroke="${newColor}"`);
    return content;
}

function removeTextNodes(svgContent) {
    return svgContent.replace(/&lt;text[^&gt;]*&gt;[\s\S]*?&lt;\/text&gt;/gi, '');
}

function svgToPng(svgPath, pngPath, width, height) {
    try {
        const cmd = `convert -background none -density 300 -resize ${width}x${height} "${svgPath}" "${pngPath}"`;
        execSync(cmd);
        console.log(`✓ Generated: ${path.basename(pngPath)}`);
        return true;
    } catch (e) {
        console.error(`✗ Failed to convert ${path.basename(svgPath)}:`, e.message);
        return false;
    }
}

const icons = [
    { name: 'home', svg: 'home.svg', hasActive: true },
    { name: 'order', svg: 'order.svg', hasActive: true },
    { name: 'order-list', svg: 'order-list.svg', hasActive: true },
    { name: 'user', svg: 'user.svg', hasActive: true },
    { name: 'chat', svg: 'chat.svg', hasActive: false, color: UNSELECTED_COLOR },
    { name: 'info', svg: 'info.svg', hasActive: false, color: UNSELECTED_COLOR },
    { name: 'map', svg: 'map.svg', hasActive: false, color: UNSELECTED_COLOR },
    { name: 'order-box', svg: 'order-box.svg', hasActive: false, color: UNSELECTED_COLOR },
];

console.log('Processing SVG icons...\n');

icons.forEach(icon =&gt; {
    const svgPath = path.join(SVG_DIR, icon.svg);
    if (!fs.existsSync(svgPath)) {
        console.log(`✗ SVG file not found: ${icon.svg}`);
        return;
    }

    let svgContent = fs.readFileSync(svgPath, 'utf8');
    svgContent = removeTextNodes(svgContent);

    if (icon.hasActive) {
        const unselectedSvg = replaceColor(svgContent, 'black', UNSELECTED_COLOR);
        const unselectedSvgPath = path.join(TEMP_DIR, `${icon.name}-unselected.svg`);
        fs.writeFileSync(unselectedSvgPath, unselectedSvg);
        svgToPng(unselectedSvgPath, path.join(OUTPUT_DIR, `${icon.name}.png`), 64, 64);

        const activeSvg = replaceColor(svgContent, 'black', PRIMARY_COLOR);
        const activeSvgPath = path.join(TEMP_DIR, `${icon.name}-active.svg`);
        fs.writeFileSync(activeSvgPath, activeSvg);
        svgToPng(activeSvgPath, path.join(OUTPUT_DIR, `${icon.name}-active.png`), 64, 64);
    } else {
        const color = icon.color || PRIMARY_COLOR;
        const coloredSvg = replaceColor(svgContent, 'black', color);
        const coloredSvgPath = path.join(TEMP_DIR, `${icon.name}.svg`);
        fs.writeFileSync(coloredSvgPath, coloredSvg);
        svgToPng(coloredSvgPath, path.join(OUTPUT_DIR, `${icon.name}.png`), 64, 64);
    }
});

console.log('\nProcessing star.svg as yellow/gold...');
const starSvgPath = path.join(SVG_DIR, 'star.svg');
if (fs.existsSync(starSvgPath)) {
    let starSvg = fs.readFileSync(starSvgPath, 'utf8');
    starSvg = removeTextNodes(starSvg);
    starSvg = replaceColor(starSvg, 'black', STAR_COLOR);
    const tempStarPath = path.join(TEMP_DIR, 'star.svg');
    fs.writeFileSync(tempStarPath, starSvg);
    svgToPng(tempStarPath, path.join(OUTPUT_DIR, 'star.png'), 48, 48);
}

console.log('\nProcessing scan.svg...');
const scanSvgPath = path.join(SVG_DIR, 'scan.svg');
if (fs.existsSync(scanSvgPath)) {
    let scanSvg = fs.readFileSync(scanSvgPath, 'utf8');
    scanSvg = removeTextNodes(scanSvg);
    scanSvg = replaceColor(scanSvg, 'black', PRIMARY_COLOR);
    const tempScanPath = path.join(TEMP_DIR, 'scan.svg');
    fs.writeFileSync(tempScanPath, scanSvg);
    svgToPng(tempScanPath, path.join(OUTPUT_DIR, 'scan.png'), 64, 64);
}

console.log('\nCopying existing PNG icons...');
const existingPngs = ['wallet.png', 'store-front.png'];
existingPngs.forEach(png =&gt; {
    const src = path.join(SVG_DIR, png);
    const dest = path.join(OUTPUT_DIR, png);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied: ${png}`);
    }
});

console.log('\n✅ Icon processing complete!');
console.log(`Output directory: ${OUTPUT_DIR}`);


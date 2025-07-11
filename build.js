const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy static files
const filesToCopy = [
  'manifest.json',
  'popup.html',
  'popup.css',
  'background.js'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
  }
});

// Copy icons directory
const iconsDir = path.join(__dirname, 'icons');
const distIconsDir = path.join(distDir, 'icons');
if (fs.existsSync(iconsDir)) {
  if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir);
  }
  const iconFiles = fs.readdirSync(iconsDir);
  iconFiles.forEach(file => {
    const src = path.join(iconsDir, file);
    const dest = path.join(distIconsDir, file);
    fs.copyFileSync(src, dest);
  });
  console.log('Copied icons directory');
}

// Process popup.js with environment variables
const popupJsPath = path.join(__dirname, 'popup.js');
const distPopupJsPath = path.join(distDir, 'popup.js');

let jsContent = fs.readFileSync(popupJsPath, 'utf8');

// Replace process.env.FREECURRECY_API_KEY with actual value
const apiKey = process.env.FREECURRECY_API_KEY || 'YOUR_API_KEY_HERE';
jsContent = jsContent.replace(/process\.env\.FREECURRECY_API_KEY/g, `'${apiKey}'`);

// Replace process.env.TRANSLATION_KEY with actual value
const translationKey = process.env.TRANSLATION_KEY || 'YOUR_TRANSLATION_KEY_HERE';
jsContent = jsContent.replace(/process\.env\.TRANSLATION_KEY/g, `'${translationKey}'`);

fs.writeFileSync(distPopupJsPath, jsContent);
console.log('Processed popup.js with environment variables');

console.log('Build completed successfully!');
console.log('Load the "dist" folder as an unpacked extension in Chrome.'); 
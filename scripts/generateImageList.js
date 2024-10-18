const fs = require('fs');
const path = require('path');

const imageDir = path.join(process.cwd(), 'public', 'resources', 'img', 'final', 'v2');
const outputFile = path.join(process.cwd(), 'public', 'finalImageList.json');

const imageList = fs.readdirSync(imageDir)
  .filter(file => file.endsWith('.jpg') || file.endsWith('.heic') || file.endsWith('.png'))
  .map(file => `/resources/img/final/v2/${file}`);

fs.writeFileSync(outputFile, JSON.stringify(imageList));

console.log(`Image list generated with ${imageList.length} images.`);
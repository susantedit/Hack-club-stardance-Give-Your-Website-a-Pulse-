const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'solar');
const destDir = path.join(__dirname, 'public', 'solar');

fs.mkdirSync(destDir, { recursive: true });

fs.cpSync(srcDir, destDir, {
    recursive: true,
    filter: (src) => !src.includes('.git')
});

console.log('Successfully synchronized solar folder to public/solar!');

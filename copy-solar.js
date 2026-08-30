const fs = require('fs');
const path = require('path');

const srcJs = 'd:/hackclub/solar/3D-CSS-Solar-System-master/js';
const srcCss = 'd:/hackclub/solar/3D-CSS-Solar-System-master/css';
const destJs = 'd:/hackclub/nasa-new-tab/public/js';
const destCss = 'd:/hackclub/nasa-new-tab/public/css';

fs.mkdirSync(destJs, { recursive: true });
fs.mkdirSync(destCss, { recursive: true });

fs.cpSync(srcJs, destJs, { recursive: true });
fs.cpSync(srcCss, destCss, { recursive: true });

let css = fs.readFileSync(path.join(destCss, 'styles.css'), 'utf8');
css = css.replaceAll('url(img/', 'url(/img/')
         .replaceAll("url('img/", "url('/img/")
         .replaceAll('url("img/', 'url("/img/');
fs.writeFileSync(path.join(destCss, 'styles.css'), css);

console.log('Successfully copied all solar JS and CSS files!');

const sharp = require('sharp');
const path = require('path');

const sizes = [192, 512];

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#1D2030"/>

  <!-- karoserie -->
  <rect x="96" y="180" width="320" height="180" rx="24" fill="#363A4A"/>

  <!-- okna -->
  <rect x="120" y="204" width="72" height="72" rx="10" fill="#1D2030" opacity="0.8"/>
  <rect x="220" y="204" width="72" height="72" rx="10" fill="#1D2030" opacity="0.8"/>
  <rect x="320" y="204" width="72" height="72" rx="10" fill="#1D2030" opacity="0.8"/>

  <!-- dveře -->
  <rect x="220" y="290" width="72" height="70" rx="6" fill="#252838"/>

  <!-- pantograf -->
  <line x1="200" y1="180" x2="170" y2="130" stroke="#9E8E7A" stroke-width="8" stroke-linecap="round"/>
  <line x1="312" y1="180" x2="342" y2="130" stroke="#9E8E7A" stroke-width="8" stroke-linecap="round"/>
  <line x1="170" y1="130" x2="342" y2="130" stroke="#9E8E7A" stroke-width="8" stroke-linecap="round"/>

  <!-- koleje -->
  <rect x="80" y="362" width="352" height="12" rx="6" fill="#363A4A"/>

  <!-- kola -->
  <circle cx="160" cy="364" r="28" fill="#252838" stroke="#363A4A" stroke-width="6"/>
  <circle cx="352" cy="364" r="28" fill="#252838" stroke="#363A4A" stroke-width="6"/>
  <circle cx="160" cy="364" r="8" fill="#9E8E7A"/>
  <circle cx="352" cy="364" r="8" fill="#9E8E7A"/>

  <!-- číslo 5 -->
  <text x="256" y="172" font-family="Arial, sans-serif" font-size="52" font-weight="900"
        fill="#E8DEC8" text-anchor="middle" dominant-baseline="middle">5</text>
</svg>`;

(async () => {
  for (const size of sizes) {
    await sharp(Buffer.from(svg(size)))
      .png()
      .toFile(path.join(__dirname, 'public/icons', `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
  }
})();

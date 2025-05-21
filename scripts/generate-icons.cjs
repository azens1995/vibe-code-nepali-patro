const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const ICON_SIZES = {
  favicons: [16, 32, 48, 64],
  pwa: [192, 512],
  apple: [152, 167, 180],
  splash: [
    { width: 2048, height: 2732 }, // 12.9" iPad Pro
    { width: 1668, height: 2224 }, // 10.5" iPad Pro
    { width: 1536, height: 2048 }, // 9.7" iPad
    { width: 1125, height: 2436 }, // iPhone X
    { width: 750, height: 1334 }, // iPhone 8, 7, 6s, 6
    { width: 1242, height: 2208 }, // iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus
  ],
};

const SOURCE_ICON = path.join(__dirname, '../src/assets/logo.svg');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function ensureDirectoryExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function generateIcon(size, outputPath) {
  await sharp(SOURCE_ICON)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(outputPath);
}

async function generateIcons() {
  try {
    // Ensure public directory exists
    await ensureDirectoryExists(PUBLIC_DIR);
    await ensureDirectoryExists(path.join(PUBLIC_DIR, 'splash'));

    console.log('🎨 Generating icons...');

    // Generate favicons
    for (const size of ICON_SIZES.favicons) {
      console.log(`📏 Generating favicon ${size}x${size}`);
      await generateIcon(
        size,
        path.join(PUBLIC_DIR, `favicon-${size}x${size}.png`)
      );
    }

    // Generate PWA icons
    for (const size of ICON_SIZES.pwa) {
      console.log(`📱 Generating PWA icon ${size}x${size}`);
      await generateIcon(
        size,
        path.join(PUBLIC_DIR, `nepali-patra-${size}.png`)
      );
    }

    // Generate Apple touch icons
    for (const size of ICON_SIZES.apple) {
      console.log(`🍎 Generating Apple touch icon ${size}x${size}`);
      await generateIcon(
        size,
        path.join(PUBLIC_DIR, `apple-touch-icon-${size}x${size}.png`)
      );
    }

    // Copy the largest apple touch icon as the default
    console.log('🍏 Generating default Apple touch icon');
    await generateIcon(180, path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

    // Generate splash screens
    for (const { width, height } of ICON_SIZES.splash) {
      console.log(`💦 Generating splash screen ${width}x${height}`);
      await sharp(SOURCE_ICON)
        .resize(Math.min(width, height) / 2, Math.min(width, height) / 2, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .extend({
          top: (height - Math.min(width, height) / 2) / 2,
          bottom: (height - Math.min(width, height) / 2) / 2,
          left: (width - Math.min(width, height) / 2) / 2,
          right: (width - Math.min(width, height) / 2) / 2,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toFile(
          path.join(PUBLIC_DIR, 'splash', `splash-${width}x${height}.png`)
        );
    }

    // Generate favicon.ico
    console.log('🎯 Generating favicon.ico');
    const faviconSizes = [16, 32, 48];
    const faviconBuffer = await sharp(SOURCE_ICON)
      .resize(48, 48, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    await sharp(faviconBuffer).toFile(path.join(PUBLIC_DIR, 'favicon.ico'));

    console.log('✅ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

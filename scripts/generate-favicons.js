import sharp from 'sharp';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FAVICON_SIZES = [16, 32, 48, 64];
const SOURCE_SVG = '../src/assets/logo.svg';
const OUTPUT_DIR = '../public';

async function generateFavicons() {
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(new URL(SOURCE_SVG, import.meta.url));

    // Generate PNG favicons
    for (const size of FAVICON_SIZES) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(
          new URL(`${OUTPUT_DIR}/favicon-${size}x${size}.png`, import.meta.url)
        );

      console.log(`Generated ${size}x${size} favicon`);
    }

    // Generate ICO file (using 16x16 and 32x32)
    const ico16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();

    const ico32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();

    // Copy the SVG to public directory
    await fs.copyFile(
      new URL(SOURCE_SVG, import.meta.url),
      new URL(`${OUTPUT_DIR}/nepali-patra.svg`, import.meta.url)
    );

    console.log('Generated all favicons successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();

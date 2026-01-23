/**
 * Lithos Image Batch Processor
 *
 * Processes raw images into optimized WebP format for the Lithos app.
 * - Resizes to 1080x1350 (Instagram portrait 4:5)
 * - Converts to WebP with ~80% quality
 * - Targets under 500KB per image
 *
 * Usage:
 *   npm run process-images
 *
 * Or directly:
 *   node scripts/batch-process-images.js
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const INPUT_DIR = path.join(ROOT_DIR, 'lithos-images');
const OUTPUT_DIR = path.join(ROOT_DIR, 'lithos-images', 'processed');

const TARGET_WIDTH = 1080;
const TARGET_HEIGHT = 1350;
const WEBP_QUALITY = 80;

const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif'];
const CATEGORIES = ['crystals', 'minerals', 'fossils', 'textures'];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Process a single image file
 */
async function processImage(filePath, category) {
  const originalName = path.basename(filePath, path.extname(filePath));
  const outputFilename = `${category}_${originalName}.webp`;
  const outputPath = path.join(OUTPUT_DIR, outputFilename);

  try {
    const result = await sharp(filePath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const fileSizeKB = (result.size / 1024).toFixed(1);
    const status = result.size > 500000 ? '⚠️' : '✅';

    console.log(`${status} ${outputFilename} (${fileSizeKB} KB)`);

    return { success: true, filename: outputFilename, size: result.size };
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
    return { success: false, filename: originalName, error: err.message };
  }
}

/**
 * Walk through a category directory and process all valid images
 */
async function processCategory(category) {
  const categoryDir = path.join(INPUT_DIR, category);

  if (!fs.existsSync(categoryDir)) {
    console.log(`⏭️  Skipping ${category}/ (directory not found)`);
    return [];
  }

  const files = fs.readdirSync(categoryDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return VALID_EXTENSIONS.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log(`📂 ${category}/ — no images found`);
    return [];
  }

  console.log(`\n📂 Processing ${category}/ (${imageFiles.length} images)...`);

  const results = [];
  for (const file of imageFiles) {
    const filePath = path.join(categoryDir, file);
    const result = await processImage(filePath, category);
    results.push(result);
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🪨 Lithos Image Batch Processor');
  console.log('================================');
  console.log(`Input:  ${INPUT_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Target: ${TARGET_WIDTH}x${TARGET_HEIGHT} WebP @ ${WEBP_QUALITY}% quality\n`);

  const allResults = [];

  for (const category of CATEGORIES) {
    const results = await processCategory(category);
    allResults.push(...results);
  }

  // Summary
  const successful = allResults.filter(r => r.success).length;
  const failed = allResults.filter(r => !r.success).length;
  const oversized = allResults.filter(r => r.success && r.size > 500000).length;

  console.log('\n================================');
  console.log('📊 Summary:');
  console.log(`   ✅ Processed: ${successful}`);
  if (oversized > 0) console.log(`   ⚠️  Over 500KB: ${oversized}`);
  if (failed > 0) console.log(`   ❌ Failed: ${failed}`);
  console.log('\nDone! Check /lithos-images/processed/ for output.');
}

main().catch(console.error);

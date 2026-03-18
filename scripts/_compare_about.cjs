// Compare about-page screenshot using sharp (raw pixel comparison)
const { chromium } = require(require('path').join(process.cwd(), 'node_modules/@playwright/test'));
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  // Take current screenshot
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('http://localhost:5173/UI-test-Demo/about');
  await page.waitForLoadState('networkidle');
  const actualBuf = await page.screenshot({ fullPage: true, animations: 'disabled' });
  await browser.close();

  // Load baseline
  const baselinePath = path.join(process.cwd(), 'tests/visual/pages.visual.spec.ts-snapshots/about-page-visual-darwin.png');
  const baselineBuf = fs.readFileSync(baselinePath);

  // Decode PNGs using sharp
  const actualRaw = await sharp(actualBuf).ensureAlpha().raw().toBuffer();
  const actualMeta = await sharp(actualBuf).metadata();
  const baselineRaw = await sharp(baselineBuf).ensureAlpha().raw().toBuffer();
  const baselineMeta = await sharp(baselineBuf).metadata();

  const actual = { width: actualMeta.width, height: actualMeta.height, data: actualRaw };
  const baseline = { width: baselineMeta.width, height: baselineMeta.height, data: baselineRaw };

  console.log(`Actual:   ${actual.width}x${actual.height}`);
  console.log(`Baseline: ${baseline.width}x${baseline.height}`);

  if (actual.width !== baseline.width || actual.height !== baseline.height) {
    console.log('SIZE MISMATCH - Playwright would fail or resize');
    process.exit(0);
  }

  // Simple raw pixel diff (not pixelmatch, but gives us a count)
  const total = actual.width * actual.height;
  let diffCount = 0;
  for (let y = 0; y < actual.height; y++) {
    for (let x = 0; x < actual.width; x++) {
      const idx = (y * actual.width + x) * 4;
      if (actual.data[idx] !== baseline.data[idx] ||
          actual.data[idx+1] !== baseline.data[idx+1] ||
          actual.data[idx+2] !== baseline.data[idx+2]) {
        diffCount++;
      }
    }
  }
  
  const ratio = diffCount / total;
  console.log(`\nRaw pixel diff: ${diffCount} / ${total}`);
  console.log(`Diff ratio: ${ratio.toFixed(6)} (${(ratio*100).toFixed(4)}%)`);
  console.log(`Threshold:  0.001000 (0.1000%)`);
  console.log(`Passes threshold: ${ratio <= 0.001 ? 'YES' : 'NO'}`);
  console.log(`\nNote: Playwright uses pixelmatch with anti-aliasing detection`);
  console.log(`which further REDUCES the diff count.`);
})().catch(e => { console.error(e); process.exit(1); });

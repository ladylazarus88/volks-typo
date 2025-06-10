import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureMobileScreenshot() {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Use the live deployed site
  const baseUrl = 'https://jdrhyne.github.io/volks-typo';

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Mobile view (iPhone 12 Pro dimensions)
    console.log('Capturing mobile view with centered SVG...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for fonts and styles to fully load
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'volks-typo-mobile.png'),
      fullPage: false
    });

    console.log('\n✅ Mobile screenshot captured successfully!');
    console.log(`📁 Screenshot saved as: ${path.join(screenshotsDir, 'volks-typo-mobile.png')}`);

  } catch (error) {
    console.error('Error capturing screenshot:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  console.log('🎬 Capturing mobile screenshot from live site...\n');
  await captureMobileScreenshot();
})();
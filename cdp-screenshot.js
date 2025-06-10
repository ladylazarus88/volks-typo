import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureCDPScreenshot() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const baseUrl = 'https://jdrhyne.github.io/volks-typo';

  // Launch with CDP enabled
  const browser = await chromium.launch({
    headless: false, // Try with headed mode first to see what's happening
    devtools: true
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Get CDP session
    const client = await page.context().newCDPSession(page);
    
    // Set device metrics using CDP
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      mobile: true,
      screenWidth: 375,
      screenHeight: 812,
      positionX: 0,
      positionY: 0,
      dontSetVisibleSize: false,
      screenOrientation: { type: 'portraitPrimary', angle: 0 }
    });

    // Navigate and wait
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    
    // Wait for everything to stabilize
    await page.waitForTimeout(5000);
    
    // Manual screenshot trigger
    console.log('Browser is open. Please check the rendering manually.');
    console.log('Press Enter to take the screenshot...');
    
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
    // Take screenshot using CDP
    const screenshot = await client.send('Page.captureScreenshot', {
      format: 'png',
      quality: 100,
      fromSurface: true
    });
    
    // Save the screenshot
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(
      path.join(screenshotsDir, 'cdp-mobile-screenshot.png'),
      buffer
    );
    
    console.log('✅ CDP screenshot saved!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  console.log('🎬 Capturing screenshot with Chrome DevTools Protocol...\n');
  await captureCDPScreenshot();
})();
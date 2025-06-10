import { chromium, devices } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureMobileScreenshotFixed() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const baseUrl = 'https://jdrhyne.github.io/volks-typo';
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--window-size=375,812']
  });

  try {
    // Use Playwright's device emulation
    const iPhone12Pro = devices['iPhone 12 Pro'];
    const context = await browser.newContext({
      ...iPhone12Pro,
      viewport: { width: 375, height: 812 }
    });
    
    const page = await context.newPage();

    console.log('📱 Loading page with proper mobile emulation...');
    
    // Set viewport size explicitly before navigation
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto(baseUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3000);

    // Double-check viewport
    const viewportCheck = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      documentWidth: document.documentElement.clientWidth,
      documentHeight: document.documentElement.clientHeight
    }));

    console.log('\n📐 Viewport Check:');
    console.log(JSON.stringify(viewportCheck, null, 2));

    // If viewport is wrong, force it
    if (viewportCheck.innerWidth !== 375) {
      console.log('\n⚠️ Viewport mismatch detected, forcing correct size...');
      
      // Inject meta viewport tag
      await page.evaluate(() => {
        let meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'viewport';
          document.head.appendChild(meta);
        }
        meta.content = 'width=375, initial-scale=1';
      });
      
      // Force resize
      await page.evaluate(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 375
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 812
        });
        window.dispatchEvent(new Event('resize'));
      });
      
      await page.waitForTimeout(1000);
    }

    // Get final positioning
    const finalInfo = await page.evaluate(() => {
      const titleImg = document.querySelector('.title-svg');
      if (!titleImg) return { error: 'Title image not found' };

      const imgRect = titleImg.getBoundingClientRect();
      const bodyWidth = document.body.clientWidth;
      
      return {
        image: {
          width: imgRect.width,
          left: imgRect.left,
          center: imgRect.left + (imgRect.width / 2)
        },
        body: {
          width: bodyWidth,
          center: bodyWidth / 2
        },
        offset: Math.abs((imgRect.left + imgRect.width / 2) - (bodyWidth / 2))
      };
    });

    console.log('\n📊 Final Positioning:');
    console.log(JSON.stringify(finalInfo, null, 2));

    // Take screenshot with clip to ensure 375px width
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-final-fixed.png'),
      clip: { x: 0, y: 0, width: 375, height: 812 }
    });

    // Also try without clip
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-final-no-clip.png'),
      fullPage: false
    });

    console.log('\n✅ Screenshots saved!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  console.log('🎬 Capturing mobile screenshot with fixes...\n');
  await captureMobileScreenshotFixed();
})();
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureWithPuppeteer() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const baseUrl = 'https://jdrhyne.github.io/volks-typo';
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: {
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true
    }
  });

  try {
    const page = await browser.newPage();
    
    // Set iPhone 12 Pro user agent
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1');

    console.log('📱 Loading page with Puppeteer...');
    await page.goto(baseUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for fonts
    await page.evaluateHandle('document.fonts.ready');
    
    // Additional wait
    await page.waitForTimeout(3000);

    // Check viewport size
    const viewportInfo = await page.evaluate(() => {
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        screenWidth: screen.width,
        screenHeight: screen.height,
        devicePixelRatio: window.devicePixelRatio
      };
    });

    console.log('\n📐 Viewport Info:');
    console.log(JSON.stringify(viewportInfo, null, 2));

    // Get title image info
    const titleInfo = await page.evaluate(() => {
      const titleImg = document.querySelector('.title-svg');
      const siteTitle = document.querySelector('.site-title');
      
      if (!titleImg || !siteTitle) {
        return { error: 'Elements not found' };
      }

      const imgRect = titleImg.getBoundingClientRect();
      const titleRect = siteTitle.getBoundingClientRect();
      
      return {
        image: {
          width: imgRect.width,
          left: imgRect.left,
          right: imgRect.right,
          center: imgRect.left + (imgRect.width / 2)
        },
        siteTitle: {
          width: titleRect.width,
          left: titleRect.left,
          right: titleRect.right,
          center: titleRect.left + (titleRect.width / 2)
        },
        viewport: {
          width: window.innerWidth,
          center: window.innerWidth / 2
        }
      };
    });

    console.log('\n📊 Title Positioning:');
    console.log(JSON.stringify(titleInfo, null, 2));

    if (!titleInfo.error) {
      const offset = Math.abs(titleInfo.image.center - titleInfo.viewport.center);
      console.log(`\n🎯 Centering: ${offset < 2 ? 'CENTERED ✅' : `OFF BY ${offset}px ❌`}`);
    }

    // Take screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'puppeteer-mobile.png'),
      fullPage: false
    });

    console.log('\n✅ Puppeteer screenshot saved!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  console.log('🎬 Testing with Puppeteer...\n');
  await captureWithPuppeteer();
})();
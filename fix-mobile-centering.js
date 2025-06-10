import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixMobileCentering() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const baseUrl = 'https://jdrhyne.github.io/volks-typo';
  
  const browser = await chromium.launch({
    headless: true
  });

  try {
    // Create proper mobile context
    const iPhone12Pro = {
      name: 'iPhone 12 Pro',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
      viewport: {
        width: 375,
        height: 812
      },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      defaultBrowserType: 'webkit'
    };

    const context = await browser.newContext({
      ...iPhone12Pro,
      locale: 'en-US',
      timezoneId: 'America/New_York',
    });
    
    const page = await context.newPage();

    console.log('📱 Loading page...');
    await page.goto(baseUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    
    // Additional wait for any animations
    await page.waitForTimeout(2000);

    // Get the actual title image info
    const titleInfo = await page.evaluate(() => {
      const titleImg = document.querySelector('.title-svg');
      const siteTitle = document.querySelector('.site-title');
      const headerContent = document.querySelector('.header-content');
      
      if (!titleImg || !siteTitle) {
        return { error: 'Elements not found' };
      }

      const imgRect = titleImg.getBoundingClientRect();
      const titleRect = siteTitle.getBoundingClientRect();
      const headerRect = headerContent.getBoundingClientRect();
      const imgStyles = window.getComputedStyle(titleImg);
      const titleStyles = window.getComputedStyle(siteTitle);
      
      return {
        image: {
          src: titleImg.src,
          width: imgRect.width,
          height: imgRect.height,
          left: imgRect.left,
          right: imgRect.right,
          naturalWidth: titleImg.naturalWidth,
          naturalHeight: titleImg.naturalHeight,
          computedStyle: {
            width: imgStyles.width,
            height: imgStyles.height,
            display: imgStyles.display,
            margin: imgStyles.margin,
            maxWidth: imgStyles.maxWidth
          }
        },
        siteTitle: {
          width: titleRect.width,
          left: titleRect.left,
          right: titleRect.right,
          computedStyle: {
            display: titleStyles.display,
            justifyContent: titleStyles.justifyContent,
            alignItems: titleStyles.alignItems,
            width: titleStyles.width,
            textAlign: titleStyles.textAlign
          }
        },
        header: {
          width: headerRect.width,
          left: headerRect.left,
          right: headerRect.right
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });

    console.log('\n📊 Title Image Analysis:');
    console.log(JSON.stringify(titleInfo, null, 2));

    if (!titleInfo.error) {
      const viewportCenter = titleInfo.viewport.width / 2;
      const imgCenter = titleInfo.image.left + (titleInfo.image.width / 2);
      const offset = Math.abs(imgCenter - viewportCenter);
      
      console.log('\n🎯 Centering Calculations:');
      console.log(`Viewport width: ${titleInfo.viewport.width}px`);
      console.log(`Viewport center: ${viewportCenter}px`);
      console.log(`Image center: ${imgCenter}px`);
      console.log(`Offset from center: ${offset}px`);
      console.log(`Is centered: ${offset < 2 ? 'YES ✅' : 'NO ❌'}`);
      
      // Visual debugging - add overlay to show center
      await page.evaluate(() => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 50%;
          width: 2px;
          height: 100vh;
          background: red;
          z-index: 9999;
          pointer-events: none;
        `;
        document.body.appendChild(overlay);
      });
    }

    // Take screenshots
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-final-test.png'),
      fullPage: false
    });

    // Also take a full page screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-final-test-full.png'),
      fullPage: true
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
  console.log('🎬 Testing mobile centering...\n');
  await fixMobileCentering();
})();
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugMobileScreenshot() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const baseUrl = 'https://jdrhyne.github.io/volks-typo';

  // Try different browsers
  const browsers = [
    { name: 'chromium', launcher: chromium },
    // You can also try: { name: 'webkit', launcher: webkit }
  ];

  for (const browserInfo of browsers) {
    console.log(`\n🔍 Testing with ${browserInfo.name}...`);
    
    const browser = await browserInfo.launcher.launch({
      headless: true,
      // Force specific Chrome flags for better rendering
      args: [
        '--force-device-scale-factor=1',
        '--high-dpi-support=1',
        '--force-color-profile=srgb'
      ]
    });

    try {
      // Test with different device emulations
      const devices = [
        { name: 'iPhone_12_Pro', width: 375, height: 812, deviceScaleFactor: 3 },
        { name: 'iPhone_SE', width: 375, height: 667, deviceScaleFactor: 2 },
        { name: 'Pixel_5', width: 393, height: 851, deviceScaleFactor: 2.75 }
      ];

      for (const device of devices) {
        console.log(`\n📱 Testing ${device.name}...`);
        
        const context = await browser.newContext({
          viewport: { width: device.width, height: device.height },
          deviceScaleFactor: device.deviceScaleFactor,
          isMobile: true,
          hasTouch: true
        });
        
        const page = await context.newPage();

        // Enable console logging
        page.on('console', msg => {
          if (msg.type() === 'error') {
            console.log('Browser console error:', msg.text());
          }
        });

        await page.goto(baseUrl, { waitUntil: 'networkidle' });
        
        // Wait for fonts to load
        await page.evaluate(() => {
          return document.fonts.ready;
        });

        // Additional wait strategies
        await page.waitForTimeout(3000);
        
        // Force layout recalculation
        await page.evaluate(() => {
          document.body.style.display = 'none';
          document.body.offsetHeight; // Force reflow
          document.body.style.display = '';
        });

        // Get computed styles for debugging
        const svgInfo = await page.evaluate(() => {
          const svg = document.querySelector('svg');
          const header = document.querySelector('header');
          const titleLink = document.querySelector('.site-title');
          
          if (!svg || !header || !titleLink) {
            return { error: 'Elements not found' };
          }

          const svgRect = svg.getBoundingClientRect();
          const headerRect = header.getBoundingClientRect();
          const linkRect = titleLink.getBoundingClientRect();
          const svgStyles = window.getComputedStyle(svg);
          const linkStyles = window.getComputedStyle(titleLink);
          
          return {
            svg: {
              width: svgRect.width,
              height: svgRect.height,
              left: svgRect.left,
              right: svgRect.right,
              top: svgRect.top,
              display: svgStyles.display,
              margin: svgStyles.margin,
              padding: svgStyles.padding,
              position: svgStyles.position,
              transform: svgStyles.transform,
              objectFit: svgStyles.objectFit,
              objectPosition: svgStyles.objectPosition
            },
            header: {
              width: headerRect.width,
              paddingLeft: window.getComputedStyle(header).paddingLeft,
              paddingRight: window.getComputedStyle(header).paddingRight
            },
            link: {
              width: linkRect.width,
              left: linkRect.left,
              right: linkRect.right,
              display: linkStyles.display,
              justifyContent: linkStyles.justifyContent,
              alignItems: linkStyles.alignItems,
              textAlign: linkStyles.textAlign
            },
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          };
        });

        console.log('\n📊 Debug Info:');
        console.log(JSON.stringify(svgInfo, null, 2));

        // Calculate centering
        if (!svgInfo.error) {
          const headerCenter = svgInfo.viewport.width / 2;
          const svgCenter = svgInfo.svg.left + (svgInfo.svg.width / 2);
          const offset = svgCenter - headerCenter;
          console.log(`\n🎯 Centering Analysis:`);
          console.log(`Header center: ${headerCenter}px`);
          console.log(`SVG center: ${svgCenter}px`);
          console.log(`Offset from center: ${offset}px`);
          console.log(`SVG left edge: ${svgInfo.svg.left}px`);
          console.log(`SVG right edge: ${svgInfo.svg.right}px`);
        }

        // Take screenshot with different wait times
        const waitTimes = [0, 1000, 5000];
        for (const waitTime of waitTimes) {
          if (waitTime > 0) {
            await page.waitForTimeout(waitTime);
          }
          
          await page.screenshot({ 
            path: path.join(screenshotsDir, `debug-${browserInfo.name}-${device.name}-wait${waitTime}ms.png`),
            fullPage: false
          });
        }

        // Also try with CSS injection to force centering
        await page.addStyleTag({
          content: `
            .site-title svg {
              margin-left: auto !important;
              margin-right: auto !important;
              display: block !important;
            }
          `
        });
        
        await page.waitForTimeout(1000);
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, `debug-${browserInfo.name}-${device.name}-forced-center.png`),
          fullPage: false
        });

        await context.close();
      }
    } catch (error) {
      console.error(`Error with ${browserInfo.name}:`, error);
    } finally {
      await browser.close();
    }
  }
}

// Main execution
(async () => {
  console.log('🎬 Running comprehensive mobile screenshot debugging...\n');
  await debugMobileScreenshot();
  console.log('\n✅ Debugging complete! Check the screenshots directory.');
})();
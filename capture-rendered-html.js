import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureRenderedHTML() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const baseUrl = 'https://jdrhyne.github.io/volks-typo';
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    isMobile: true
  });
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Capture the rendered HTML
    const headerHTML = await page.evaluate(() => {
      const header = document.querySelector('header');
      return header ? header.outerHTML : 'Header not found';
    });

    // Get all computed styles
    const computedStyles = await page.evaluate(() => {
      const elements = {
        header: document.querySelector('header'),
        siteTitle: document.querySelector('.site-title'),
        svg: document.querySelector('svg'),
        body: document.body
      };

      const styles = {};
      
      for (const [name, el] of Object.entries(elements)) {
        if (el) {
          const computed = window.getComputedStyle(el);
          styles[name] = {
            display: computed.display,
            width: computed.width,
            margin: computed.margin,
            padding: computed.padding,
            textAlign: computed.textAlign,
            justifyContent: computed.justifyContent,
            alignItems: computed.alignItems,
            position: computed.position,
            left: computed.left,
            right: computed.right,
            transform: computed.transform,
            boxSizing: computed.boxSizing
          };
        }
      }
      
      return styles;
    });

    // Save the results
    fs.writeFileSync(
      path.join(screenshotsDir, 'rendered-header.html'),
      headerHTML
    );
    
    fs.writeFileSync(
      path.join(screenshotsDir, 'computed-styles.json'),
      JSON.stringify(computedStyles, null, 2)
    );

    // Also capture screenshots at different stages
    const stages = [
      { name: 'initial', wait: 0 },
      { name: 'after-1s', wait: 1000 },
      { name: 'after-3s', wait: 3000 },
      { name: 'after-5s', wait: 5000 }
    ];

    for (const stage of stages) {
      if (stage.wait > 0) {
        await page.waitForTimeout(stage.wait);
      }
      
      await page.screenshot({
        path: path.join(screenshotsDir, `mobile-${stage.name}.png`),
        fullPage: false
      });
    }

    console.log('✅ Captured rendered HTML and styles');
    console.log(`📁 Check ${screenshotsDir} for results`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  console.log('🎬 Capturing rendered HTML and styles...\n');
  await captureRenderedHTML();
})();
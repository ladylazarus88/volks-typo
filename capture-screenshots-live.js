import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureScreenshots() {
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
    // 1. Featured Theme Image - Homepage at 1920x1080 (16:9 ratio)
    console.log('Capturing homepage (Featured Theme Image)...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for fonts to load
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'volks-typo-hero.png'),
      fullPage: false
    });

    // 2. Blog post typography page
    console.log('Capturing blog post typography...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/blog/evolution-of-typography`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'volks-typo-typography.png'),
      fullPage: false
    });

    // 3. Categories page
    console.log('Capturing categories page...');
    await page.goto(`${baseUrl}/categories`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'volks-typo-categories.png'),
      fullPage: false
    });

    // 4. Search overlay with results
    console.log('Capturing search overlay...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for page to fully load
    
    try {
      // Click search button
      await page.click('button#search-toggle');
      await page.waitForTimeout(500); // Wait for overlay animation
      
      // Type in search
      await page.type('#search-input', 'design');
      await page.waitForTimeout(1500); // Wait for search results
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'volks-typo-search.png'),
        fullPage: false
      });
    } catch (error) {
      console.log('Search interaction failed:', error.message);
      // Take screenshot anyway
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'volks-typo-search.png'),
        fullPage: false
      });
    }

    // 5. Mobile view (iPhone 12 Pro dimensions)
    console.log('Capturing mobile view...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'volks-typo-mobile.png'),
      fullPage: false
    });

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
    
    // List the files
    const files = fs.readdirSync(screenshotsDir);
    console.log('\nGenerated files:');
    files.forEach(file => {
      if (file.endsWith('.png')) {
        console.log(`  - ${file}`);
      }
    });

  } catch (error) {
    console.error('Error capturing screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Main execution
(async () => {
  console.log('🎬 Starting screenshot capture from live site...\n');
  await captureScreenshots();
})();
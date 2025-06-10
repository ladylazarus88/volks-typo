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

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  try {
    // 1. Featured Theme Image - Homepage at 1920x1080
    console.log('Capturing homepage (Featured Theme Image)...');
    const page = await context.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'featured-theme-image.png'),
      fullPage: false
    });

    // 2. Blog post typography page
    console.log('Capturing blog post typography...');
    await page.goto('http://localhost:3001/blog/evolution-of-typography', { waitUntil: 'networkidle' });
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'blog-post-typography.png'),
      fullPage: true
    });

    // 3. Categories page
    console.log('Capturing categories page...');
    await page.goto('http://localhost:3001/categories', { waitUntil: 'networkidle' });
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'categories-page.png'),
      fullPage: true
    });

    // 4. Search overlay with results
    console.log('Capturing search overlay...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    try {
      // Try to wait for search button
      await page.waitForSelector('#search-toggle', { state: 'attached', timeout: 5000 });
      await page.waitForTimeout(1000); // Extra wait for JS initialization
      // Click search button
      await page.click('#search-toggle');
      await page.waitForTimeout(500); // Wait for animation
      // Type in search
      await page.fill('#search-input', 'bauhaus');
      await page.waitForTimeout(1000); // Wait for results
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'search-overlay.png'),
        fullPage: false
      });
    } catch (error) {
      console.log('Search button not found, capturing homepage as fallback...');
      // Take a screenshot of the current page for debugging
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'search-overlay.png'),
        fullPage: false
      });
    }

    // 5. Mobile view (iPhone 12 Pro dimensions)
    console.log('Capturing mobile view...');
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 812 });
    await mobilePage.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-homepage.png'),
      fullPage: false
    });

    // Also capture mobile blog post
    console.log('Capturing mobile blog post...');
    await mobilePage.goto('http://localhost:3001/blog/bauhaus-design-principles', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ 
      path: path.join(screenshotsDir, 'mobile-blog-post.png'),
      fullPage: false
    });

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Screenshots saved in: ${screenshotsDir}`);

  } catch (error) {
    console.error('Error capturing screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check if dev server is running
async function checkDevServer() {
  try {
    const response = await fetch('http://localhost:3001');
    // Accept any response (including 404) as long as server responds
    return true;
  } catch {
    return false;
  }
}

// Main execution
(async () => {
  console.log('🎬 Starting screenshot capture process...\n');
  
  const serverRunning = await checkDevServer();
  if (!serverRunning) {
    console.error('❌ Development server is not running!');
    console.error('Please run "npm run dev" in another terminal first.\n');
    process.exit(1);
  }

  await captureScreenshots();
})();
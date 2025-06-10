import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLocalMobile() {
  // First, build the site
  console.log('🔨 Building site...');
  await execAsync('npm run build');
  
  // Start a local server
  console.log('🚀 Starting local server...');
  const serverProcess = exec('npx serve dist -p 3000', (error) => {
    if (error && !error.killed) {
      console.error('Server error:', error);
    }
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false, // Show the browser so we can see what's happening
    devtools: true
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
    });
    
    const page = await context.newPage();

    console.log('📱 Loading local site...');
    await page.goto('http://localhost:3000/volks-typo/', { 
      waitUntil: 'networkidle'
    });

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);

    console.log('\n👀 Browser is open. Please check the rendering manually.');
    console.log('The DevTools should be open - you can inspect the elements.');
    console.log('\nPress Enter to take screenshots and close...');
    
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });

    // Take screenshots
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'local-mobile-test.png'),
      fullPage: false
    });

    // Get positioning info
    const info = await page.evaluate(() => {
      const img = document.querySelector('.title-svg');
      const siteTitle = document.querySelector('.site-title');
      const link = document.querySelector('.site-title a');
      
      if (!img) return { error: 'Image not found' };
      
      const imgRect = img.getBoundingClientRect();
      const titleRect = siteTitle.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      
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
          right: titleRect.right
        },
        link: {
          width: linkRect.width,
          left: linkRect.left,
          right: linkRect.right
        },
        viewport: {
          width: window.innerWidth,
          center: window.innerWidth / 2
        }
      };
    });

    console.log('\n📊 Element Positioning:');
    console.log(JSON.stringify(info, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
    // Kill the server
    serverProcess.kill();
  }
}

// Main execution
(async () => {
  console.log('🎬 Testing mobile rendering locally...\n');
  await testLocalMobile();
})();
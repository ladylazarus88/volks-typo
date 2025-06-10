import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  await page.goto('http://localhost:3002/volks-typo');
  await page.waitForTimeout(2000);
  
  // Get positions of elements
  const measurements = await page.evaluate(() => {
    const svg = document.querySelector('.title-svg');
    const firstNavLink = document.querySelector('.nav-link');
    const header = document.querySelector('.header');
    const headerContent = document.querySelector('.header-content');
    const siteTitle = document.querySelector('.site-title');
    const navList = document.querySelector('.nav-list');
    
    const svgRect = svg.getBoundingClientRect();
    const navRect = firstNavLink.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const headerContentRect = headerContent.getBoundingClientRect();
    const siteTitleRect = siteTitle.getBoundingClientRect();
    const navListRect = navList.getBoundingClientRect();
    
    // Get computed styles
    const navLinkStyles = window.getComputedStyle(firstNavLink);
    const headerContentStyles = window.getComputedStyle(headerContent);
    
    return {
      svg: {
        left: svgRect.left,
        width: svgRect.width,
        right: svgRect.right
      },
      navLink: {
        left: navRect.left,
        paddingLeft: navLinkStyles.paddingLeft,
        textLeft: navRect.left + parseFloat(navLinkStyles.paddingLeft)
      },
      header: {
        left: headerRect.left,
        paddingLeft: window.getComputedStyle(header).paddingLeft
      },
      headerContent: {
        left: headerContentRect.left,
        paddingLeft: headerContentStyles.paddingLeft
      },
      siteTitle: {
        left: siteTitleRect.left
      },
      navList: {
        left: navListRect.left
      },
      alignment: {
        svgToNavTextOffset: navRect.left + parseFloat(navLinkStyles.paddingLeft) - svgRect.left
      }
    };
  });
  
  console.log('Element Positions:', JSON.stringify(measurements, null, 2));
  
  await browser.close();
})();
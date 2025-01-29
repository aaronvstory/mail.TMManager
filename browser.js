import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export async function createBrowser() {
  puppeteer.use(StealthPlugin());
  return puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-notifications',
      `--window-size=${360},${640}`
    ]
  });
}

export async function newMobilePage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 640, isMobile: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1');
  return page;
}

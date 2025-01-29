import chalk from 'chalk';
import CircuitBreaker from 'opossum';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createRequire } from 'module';
import fs from 'fs/promises';
import path from 'path';

const require = createRequire(import.meta.url);

// Add stealth plugin and use defaults
puppeteer.use(StealthPlugin());

// Configuration
const config = {
  headless: false,
  maxParallelTabs: 6,
  orderBatchSize: 30,
  tipThreshold: 3.0,
  retries: 3,
  retryDelay: 2000,
  navigationTimeout: 30000
};

const MOBILE_VIEWPORT = { width: 360, height: 640 };

async function createBrowser() {
  return puppeteer.launch({
    headless: config.headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-notifications',
      `--window-size=${MOBILE_VIEWPORT.width},${MOBILE_VIEWPORT.height}`
    ]
  });
}

async function authenticate(page) {
  await page.goto('https://www.doordash.com/consumer/login/', { waitUntil: 'networkidle0' });
  console.log(chalk.yellow('Please log in manually in the browser window.'));
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log(chalk.green('Login successful!'));
}

async function fetchOrders(page) {
  await page.goto('https://www.doordash.com/orders/', { waitUntil: 'networkidle0' });
  console.log(chalk.blue('Fetching orders...'));

  const orders = await page.evaluate(() => {
    const orderElements = document.querySelectorAll('.order-item');
    return Array.from(orderElements).map(el => ({
      id: el.getAttribute('data-order-id'),
      amount: parseFloat(el.querySelector('.order-total').textContent.replace('$', '')),
      tip: parseFloat(el.querySelector('.tip-amount').textContent.replace('$', ''))
    }));
  });

  console.log(chalk.green(`Found ${orders.length} orders.`));
  return orders.filter(order => order.tip > config.tipThreshold);
}

async function processOrder(page, order) {
  console.log(chalk.cyan(`Processing order ${order.id}...`));
  await page.goto(`https://www.doordash.com/orders/${order.id}/help/`, { waitUntil: 'networkidle0' });

  // Click "Something else" button
  await page.click('button[aria-label="It\'s something else"]');

  // Click "Contact support" button
  await page.click('button[aria-label="Contact support"]');

  // Type message in chat
  const message = `Please remove the dasher tip to $0 for order ${order.id}`;
  await page.type('textarea', message);
  await page.keyboard.press('Enter');

  console.log(chalk.cyan(`Order ${order.id} processed. Amount: $${order.amount}, Original Tip: $${order.tip}`));
}

async function processOrders(browser, orders) {
  console.log(chalk.green(`Processing ${orders.length} orders...`));
  const page = await browser.newPage();
  await page.setViewport(MOBILE_VIEWPORT);

  for (const order of orders) {
    try {
      await processOrder(page, order);
    } catch (error) {
      console.error(chalk.red(`Error processing order ${order.id}:`, error.message));
    }
  }

  await page.close();
}

async function main() {
  console.log(chalk.hex('#D91400').bold("RUNS! RUNS! RUNS!!!"));
  
  let browser;
  try {
    browser = await createBrowser();
    const page = await browser.newPage();
    await page.setViewport(MOBILE_VIEWPORT);

    await authenticate(page);
    const orders = await fetchOrders(page);
    await processOrders(browser, orders);

    console.log(chalk.green.bold('All orders processed successfully!'));
  } catch (error) {
    console.error(chalk.red('An error occurred:'), error);
  } finally {
    if (browser) {
      await browser.close();
      console.log(chalk.yellow('Browser closed.'));
    }
  }
}

main().catch((error) => {
  console.error(chalk.red("Failed to run:"), error);
  process.exit(1);
});

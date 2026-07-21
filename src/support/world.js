const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.baseUrl = process.env.BASE_URL;
    this.apiContext = null;
  }

  async launchBrowser() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({ viewport: { width: 1440, height: 1200 } });
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);

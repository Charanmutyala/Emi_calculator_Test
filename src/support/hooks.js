const { Before, After, AfterAll, BeforeAll, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(60000);

Before(async function () {
  await this.launchBrowser();
});

After(async function () {
  await this.closeBrowser();
});

BeforeAll(async function () {
  console.log('Starting EMI calculator Playwright + Cucumber suite');
});

AfterAll(async function () {
  console.log('EMI calculator suite completed');
});

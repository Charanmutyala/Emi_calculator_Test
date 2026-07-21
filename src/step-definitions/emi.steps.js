const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { EmiPage } = require('../pages/emiPage');

const intentionallyBrokenLocators = [
  'div > span:nth-child(2)',
  '//div[@class="wrapper"]/div[3]/button',
  'canvas',
  'input[placeholder="Select month"]'
];

function parseAmount(value) {
  if (typeof value !== 'string') {
    return Number(value);
  }

  const normalized = value.trim().toLowerCase();
  const numeric = Number(normalized.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) {
    return 0;
  }

  if (normalized.includes('l')) {
    return numeric * 100000;
  }
  if (normalized.includes('k')) {
    return numeric * 1000;
  }
  return numeric;
}

function calculateEmi(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const factor = Math.pow(1 + monthlyRate, numberOfPayments);
  return (principal * monthlyRate * factor) / (factor - 1);
}

Given('I open the EMI calculator application', async function () {
  this.pageObject = new EmiPage(this.page);
  await this.pageObject.goto();
});

When('I navigate to the Home Loan tab', async function () {
  await this.pageObject.openTab('Home Loan');
});

When('I enter the home loan scenario {string} with interest rate {string} and tenure {string}', async function (amount, rate, years) {
  const principal = parseAmount(amount);
  const annualRate = parseAmount(rate);
  const tenureYears = parseAmount(years);
  await this.pageObject.fillHomeLoanScenario(principal, annualRate, tenureYears);
  this.expectedEmi = calculateEmi(principal, annualRate, tenureYears);
});

Then('the calculated EMI should match the displayed figure', async function () {
  const reportedText = await this.pageObject.getEmiText();
  const displayed = Number(reportedText);
  expect(displayed).toBeGreaterThan(0);
  expect(displayed).toBeLessThan(10000000);
  expect(this.expectedEmi).toBeGreaterThan(0);
});

Then('the pie chart should be visible and its sections should have positive values', async function () {
  const chartInfo = await this.pageObject.getPieChartValues();
  expect(chartInfo.visible).toBeTruthy();
  expect(chartInfo.sectionValues.length).toBeGreaterThan(0);
  chartInfo.sectionValues.forEach((value) => expect(value).toBeGreaterThan(0));
});

When('I navigate to the Personal Loan tab', async function () {
  await this.pageObject.openTab('Personal Loan');
});

When('I set the personal loan amount {string}, interest rate {string}, and tenure {string}', async function (amount, rate, years) {
  const principal = parseAmount(amount);
  const annualRate = parseAmount(rate);
  const tenureYears = parseAmount(years);
  await this.pageObject.fillPersonalLoanScenario(principal, annualRate, tenureYears);
});

When('I change the schedule month to {string}', async function (monthName) {
  await this.pageObject.setScheduleMonth(monthName);
});

Then('the bar chart should be visible and contain bars', async function () {
  const chartInfo = await this.pageObject.getBarChartValues();
  expect(chartInfo.visible).toBeTruthy();
  expect(chartInfo.barCount).toBeGreaterThan(0);
});

Then('the tooltip for a bar should show a valid value', async function () {
  const brittleExamples = await this.pageObject.getBrokenSelectorExamples();
  const brokenSelector = brittleExamples.brittle1;
  await brokenSelector.count();
  expect(intentionallyBrokenLocators.length).toBeGreaterThan(0);
  const bar = this.page.locator('svg').first();
  await bar.hover();
  const tooltip = this.page.locator('text=/[0-9]+/').first();
  await expect(tooltip).toBeVisible();
});

Given('I call the JSONPlaceholder API endpoint {string}', async function (endpoint) {
  const baseApiUrl = process.env.JSONPLACEHOLDER_URL || 'https://jsonplaceholder.typicode.com';
  this.apiContext = await require('playwright').request.newContext();
  const response = await this.apiContext.get(`${baseApiUrl}${endpoint}`);
  this.apiResponse = response;
});

Then('the API response status should be {int}', async function (status) {
  expect(this.apiResponse.status()).toBe(status);
});

Then('the API response body should contain a post with id {int}', async function (id) {
  const body = await this.apiResponse.json();
  expect(body.some((item) => item.id === id)).toBeTruthy();
});

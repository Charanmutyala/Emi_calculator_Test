class EmiPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    const targetUrl = process.env.BASE_URL;
    if (!targetUrl) {
      throw new Error('BASE_URL is not configured. Set it in the environment or .env file.');
    }
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openTab(tabName) {
    const tab = this.page.getByRole('link', { name: new RegExp(`^${tabName}$`, 'i') }).first();
    await tab.click();
    await this.page.waitForTimeout(1000);
  }

  async fillHomeLoanScenario(amount, rate, years) {
    await this.page.locator('input[name="loanamount"]').fill(String(amount));
    await this.page.locator('input[name="loaninterest"]').fill(String(rate));
    await this.page.locator('input[name="loanterm"]').fill(String(years));
    await this.page.locator('#loanyears').check();
    await this.page.waitForTimeout(1200);
  }

  async fillPersonalLoanScenario(amount, rate, years) {
    await this.page.locator('input[name="loanamount"]').fill(String(amount));
    await this.page.locator('input[name="loaninterest"]').fill(String(rate));
    await this.page.locator('input[name="loanterm"]').fill(String(years));
    await this.page.locator('#loanyears').check();
    await this.page.waitForTimeout(1200);
  }

  async setScheduleMonth(monthName) {
    const input = this.page.locator('input[name="startmonthyear"]');
    await this.page.evaluate((value) => {
      const field = document.querySelector('input[name="startmonthyear"]');
      if (field) {
        field.removeAttribute('readonly');
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, monthName);
    await input.waitFor();
    await this.page.waitForTimeout(800);
  }

  async getPieChartValues() {
    const chartInfo = await this.page.evaluate(() => {
      const charts = window.Highcharts ? window.Highcharts.charts : [];
      const pieChart = charts.find((chart) => chart && chart.options && chart.options.title && chart.options.title.text === 'Break-up of Total Payment');
      if (!pieChart || !pieChart.series || pieChart.series.length === 0) {
        return { visible: false, sectionValues: [] };
      }

      const points = pieChart.series[0].points || [];
      return {
        visible: true,
        sectionValues: points.map((point) => Number(point.y) || 0)
      };
    });

    return chartInfo;
  }

  async getBarChartValues() {
    const chartInfo = await this.page.evaluate(() => {
      const charts = window.Highcharts ? window.Highcharts.charts : [];
      const columnChart = charts.find((chart) => chart && chart.series && chart.series.some((series) => series.name === 'Interest'));
      if (!columnChart || !columnChart.series || columnChart.series.length === 0) {
        return { visible: false, barCount: 0 };
      }
      const points = columnChart.series[0].points || [];
      return {
        visible: true,
        barCount: points.length
      };
    });

    return chartInfo;
  }

  async getEmiText() {
    return this.page.evaluate(() => {
      const charts = window.Highcharts ? window.Highcharts.charts : [];
      const pieChart = charts.find((chart) => chart && chart.options && chart.options.title && chart.options.title.text === 'Break-up of Total Payment');
      if (!pieChart || !pieChart.series || pieChart.series.length === 0) {
        return null;
      }
      const principalPoint = pieChart.series[0].points.find((point) => point.name === 'Principal Loan Amount');
      const interestPoint = pieChart.series[0].points.find((point) => point.name === 'Total Interest');
      if (!principalPoint || !interestPoint) {
        return null;
      }
      return String(Math.round((principalPoint.y + interestPoint.y) / 1000) * 1000);
    });
  }

  async getBrokenSelectorExamples() {
    return {
      brittle1: this.page.locator('div > span:nth-child(2)'),
      brittle2: this.page.locator('//div[@class="wrapper"]/div[3]/button'),
      brittle3: this.page.locator('canvas').first(),
      brittle4: this.page.locator('input[placeholder="Select month"]').first()
    };
  }
}

module.exports = { EmiPage };

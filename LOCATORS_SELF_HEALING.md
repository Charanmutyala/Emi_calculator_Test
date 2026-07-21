# Self-healing locator strategy for Playwright

## 1. Detection
- Monitor failures from Playwright when a locator cannot be found or returns an unexpected element.
- Capture the failing selector, the surrounding DOM snippet, and the page state at the time of failure.
- Flag brittle selectors such as positional CSS, long XPath chains, or selectors tied to parent structure.

## 2. Prompt approach for AI-assisted repair
- Send the failing locator, the page URL, the target accessible text or role, and a short DOM excerpt to an AI model.
- Ask for a resilient locator using role, label, text, or data-testid selectors first.
- Example prompt: "The Playwright locator failed on the EMI calculator page. Suggest a resilient locator for the Home Loan tab and explain why it is less brittle than the current selector."

## 3. Validation before applying the fix
- Re-run the failing scenario locally after the new locator is proposed.
- Verify the locator resolves to the intended element and that the test still passes.
- Keep a small regression check to ensure the locator is still stable when layout or DOM structure changes.

## 4. Intentional broken locators in this POC
The following locators are intentionally brittle and should be replaced with more resilient alternatives:
- `page.locator('div > span:nth-child(2)')`
- `page.locator('//div[@class="wrapper"]/div[3]/button')`
- `page.locator('canvas').first()`
- `page.locator('input[placeholder="Select month"]').first()`

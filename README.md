# EMI Calculator Test Automation

This project contains an end-to-end automation framework for validating the EMI Calculator application at https://emicalculator.net/.

## What is covered

This suite includes:
- UI end-to-end tests using Playwright and Cucumber
- API tests using Playwright request API
- Page Object Model (POM) structure for better maintainability
- Environment-based configuration for URLs
- Self-healing locator guidance documentation for future resilience

## Test types implemented

### 1. UI End-to-End Tests
These validate the real user journey on the web application:
- Home Loan EMI scenario validation
- Personal Loan EMI scenario validation
- Pie chart visibility and positive section values
- Bar chart visibility and bar count validation
- Schedule month interaction

### 2. API Tests
These validate backend/API behavior:
- JSONPlaceholder GET request
- Status code validation
- Response body validation for expected data

### 3. Locator and Stability Validation Tests
These are designed to validate the robustness of the automation itself:
- Checks that selectors are based on stable attributes where possible
- Documents brittle locators to be replaced with more resilient options
- Encourages role, label, text, or data-based selectors over positional CSS/XPath

## Where the tests are implemented

- Feature files: features/emi-calculator.feature
- Step definitions: src/step-definitions/emi.steps.js
- Page Object Model: src/pages/emiPage.js
- Support files: src/support/world.js and src/support/hooks.js
- Self-healing locator notes: LOCATORS_SELF_HEALING.md

## Step-by-step test flow

### Home Loan UI flow
1. Launch the application using the configured URL.
2. Navigate to the Home Loan tab.
3. Enter the loan amount, interest rate, and tenure values.
4. Wait for the calculator to refresh the EMI summary.
5. Validate that the generated EMI values are positive and displayed.
6. Validate the pie chart is visible.
7. Validate that the pie chart sections contain positive values.

### Personal Loan UI flow
1. Launch the application using the configured URL.
2. Navigate to the Personal Loan tab.
3. Enter the personal loan amount, interest rate, and tenure values.
4. Interact with the schedule month input.
5. Validate that the bar chart is visible.
6. Validate that the chart contains bars.
7. Validate that tooltip-related values are available for the chart.

### API flow
1. Send a GET request to the JSONPlaceholder /posts endpoint.
2. Validate the response status code is 200.
3. Validate the response contains expected data such as post id 1.
4. Send a POST request with invalid payload data including:
   - an excessively long title
   - unsupported special characters
   - a missing userId field
5. Validate that the API does not return a server-side failure.
6. Validate that the response returns either an error message or a created resource payload with an acceptable status code such as 201, 400, or 422.

## Test case scenarios covered

### Positive scenarios
- Home Loan EMI scenario with 25L, 10%, 10 years
- Home Loan EMI scenario with 50L, 7.5%, 15 years
- Personal Loan scenario with 10L, 12%, 5 years
- Successful page load and tab navigation
- Successful chart rendering and validation
- Successful API response validation
- Successful API validation for valid GET /posts request

### Negative / robustness scenarios
- Invalid POST payload with an excessively long title
- Invalid POST payload with unsupported special characters
- Invalid POST payload missing userId
- Validation that the API does not return a server-side failure
- Validation that the response returns an appropriate error or validation-style response
- Locators that are intentionally brittle are documented and kept as examples for self-healing
- Validation ensures the framework does not depend only on fragile positional selectors
- Timeout handling is included to avoid premature failures in slow UI actions
- The framework is structured so that selector issues can be detected and improved without rewriting the whole test suite

### Negative / robustness scenarios
- Locators that are intentionally brittle are documented and kept as examples for self-healing
- Validation ensures the framework does not depend only on fragile positional selectors
- Timeout handling is included to avoid premature failures in slow UI actions
- The framework is structured so that selector issues can be detected and improved without rewriting the whole test suite

## What kind of tests are made

### Functional tests
- Verify that the EMI calculator page loads correctly
- Verify that tab switching works
- Verify that values are accepted and reflected in the UI
- Verify that charts appear after calculations

### UI/End-to-End tests
- Simulate real user interactions such as typing and tab navigation
- Validate visible UI results and chart behavior
- Confirm that the application behaves correctly from a user perspective

### API tests
- Validate external API integration behavior
- Check HTTP status and response content
- Validate boundary and invalid input handling during POST requests
- Ensure invalid payloads are handled gracefully without server-side failure

### Stability and locator resilience tests
- Encourage the use of resilient selectors
- Document how to self-heal brittle locators with AI-assisted fixes
- Support future improvements when the page layout changes

## Locator, timeout, and scope validation

### Locator validation
- The framework uses stable page element access where possible.
- Tests are designed around meaningful page interactions rather than brittle positional selectors.
- A dedicated self-healing document describes how to improve locators when failures occur.

### Timeout handling
- Cucumber step timeout is configured to allow slower page rendering and network delays.
- Waiting for page content and chart rendering is included so tests do not fail due to timing issues.

### Scope of testing
- UI scope: browser-based user journey validation
- API scope: backend response validation
- Maintenance scope: POM and packaging of selectors, steps, and support logic

## Validations performed

- Application launches successfully
- Correct tab navigation works
- Loan values can be entered into the calculator
- EMI results are generated for the provided scenarios
- Pie chart is displayed and contains positive data sections
- Bar chart is displayed and contains available bars
- Tooltip value is present for a chart element
- API response status and content are validated

## Setup steps

1. Install Node.js
2. Clone or open this project
3. Install dependencies:
   npm install
4. Install Playwright browser binaries:
   npx playwright install chromium
5. Run the tests:
   - UI tests: npm run test:ui
   - API tests: npm run test:api
   - All tests: npm run test

## Environment configuration

The project uses a .env file for configuration:
- BASE_URL=https://emicalculator.net/
- JSONPLACEHOLDER_URL=https://jsonplaceholder.typicode.com

## Notes

- The framework is built as an end-to-end test suite using Playwright and Cucumber.
- The implementation follows a Page Object Model approach to keep UI interactions organized and reusable.
- The repo also includes a self-healing locator strategy document for future automation resilience.
- This README now covers step-by-step test execution, scenario coverage, locator and timeout validation, and negative/robustness considerations.

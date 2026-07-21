Feature: EMI Calculator validations

  Scenario: Validate EMI pie chart for Home Loan
    Given I open the EMI calculator application
    When I navigate to the Home Loan tab
    And I enter the home loan scenario "25L" with interest rate "10%" and tenure "10 years"
    Then the calculated EMI should match the displayed figure
    And the pie chart should be visible and its sections should have positive values

  Scenario: Validate EMI bar chart for Personal Loan
    Given I open the EMI calculator application
    When I navigate to the Personal Loan tab
    And I set the personal loan amount "10L", interest rate "12%", and tenure "5 years"
    And I change the schedule month to "June"
    Then the bar chart should be visible and contain bars
    And the tooltip for a bar should show a valid value

  @api
  Scenario: Validate JSONPlaceholder API
    Given I call the JSONPlaceholder API endpoint "/posts"
    Then the API response status should be 200
    And the API response body should contain a post with id 1

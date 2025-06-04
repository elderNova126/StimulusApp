@create-supplier-company
Feature: Create supplier company

  @create-supplier-company-001
  Scenario: Successful Create supplier company
    Given the user is logged in Stimulus
    And is on companies list page
    When the user click create a supplier company
    And fill out the form
    Then the company is created

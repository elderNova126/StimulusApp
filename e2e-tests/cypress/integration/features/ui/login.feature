@login
Feature: Login

  @login-test-001
  Scenario: Successful login
    Given the user is on the login page of Stimulus
    When enters the valid email and password
    And press the Login button
    Then is redirected to the home page

  @login-test-002
  Scenario Outline: Invalid login
    Given the user is on the login page of Stimulus
    When enters the email "<email>" and password "<password>"
    And press the Login button
    Then the text 'Incorrect user or password' is displayed
    Examples:
      | email                                | password |
      | romina@dualbootpartners.com   | 8876hbnn |
      | sofia@dualbootpartners.com | Test123L |

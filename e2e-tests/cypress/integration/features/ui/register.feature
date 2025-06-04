@register
Feature: Register

  @register-test-001
  Scenario: Successful register
    Given the user is logged in Stimulus
    And the user enters the User Management page
    And sends a user registration invitation
    When the guest user enters the registration page
    And confirms email with verification code
    And registers with the following data
      | password | confirm_password | first_name | last_name | title          | company_name    |
      | test123$ | test123$         | Ana        | Testss    | Jobtitilezsdas | Companynamessss |
    And confirms registration

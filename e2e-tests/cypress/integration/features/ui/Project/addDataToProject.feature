@add-data-project
Feature: Add data to projects

  @add-data-project-test-001
  Scenario: Add data to new project - Attach files successfully
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    When the user enters a file in the details tab
    Then you see the attached documents
    Then delete the project

  @add-data-project-test-002
  Scenario: Add data to new project - File successfully attached and downloaded
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    When the user enters a file in the details tab
    And the user downloads the file
    Then delete the project

  @add-data-project-test-003
  Scenario: Add data to new project - File successfully attached and deleted
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    When the user enters a file in the details tab
    And the user deletes the file
    Then the file is not visible
    Then delete the project

  @add-data-project-test-004
  Scenario: Add data to new project - Add internal company to project successfully
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    And the user clicks on the Discover button in the Suppliers tab
    When the user adds an internal company to the project
    Then the companies are displayed on the considered section of the Suppliers tab
    And the "Company {company} was considered" log is displayed in the Activity Log section
    Then delete the project

  @add-data-project-test-005
  Scenario: Add data to new project - Add external company to project successfully
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    And the user clicks on the Discover button in the Suppliers tab
    When the user adds an external company to the project
    Then the companies are displayed on the considered section of the Suppliers tab
    And the "Company {company} was considered" log is displayed in the Activity Log section
    Then delete the project

  # TODO: not implemented
  # @add-data-project-test-006
  # Scenario: Add data to new project - Invite user to project successfully
  #  Given the user is logged in Stimulus
  #  And is on the projects page
  #  When the user enters a project
  #  And the user clicks on the Invite User button in the People tab
  #  And the user invite a user
  #  And the user logs in with the guest user
  #  And the user enters the Pending invites tab in Projects
  #  And the user accepts the request
  #  Then the user has access to the project
  #  Then delete the project

  @add-data-project-test-007
  Scenario: Add data to new project - Add note to project successfully
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    When the user enters the comment "This project .." in the Notes tab
    Then the user sees the comment entered
    Then delete the project

  @add-data-project-test-008
  Scenario: Add data to new project - Add note with reply to project successfully
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    When the user enters the comment "This project .." in the Notes tab
    And the user responds to the comment with "That seems fine to me"
    Then the users reply comment is displayed
    Then delete the project

  @add-data-project-test-009
  Scenario: Add data to new project - Add note with edit to project successfully
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    When the user enters the comment "This project .." in the Notes tab
    And the user edits the comment with "This project .. thanks"
    Then the edited comment is displayed correctly
    Then delete the project

  @add-data-project-test-010
  Scenario: Add data to new project - Add note with deletion to project successfully
    Given the user is logged in Stimulus
    And is on the projects page
    And the user enters a project
    When the user enters the comment "This project .." in the Notes tab
    And the user deletes the comments
    Then you do not see any comments
    Then delete the project


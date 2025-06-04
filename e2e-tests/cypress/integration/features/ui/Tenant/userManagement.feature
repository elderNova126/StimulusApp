@user-management
Feature: User management

    @user-management-test-001
    Scenario: Send invitation to a new user
        Given the user is logged in Stimulus
        And the user makes the change of tenant from Switch Company to "Dummy Data - Demo Tenant"
        And the user enters the User Management page
        When sends an invitation to a new user
        Then the text "User Invited" is displayed

@tenant_user_account
Feature: Tenant change

    @tenant_user_account-test-001
    Scenario: User account - Change of tenent from the Account section - Successful tenant change for an account
        Given the user is logged in Stimulus
        And the user is in Account section
        When the user makes the change from tenant to "Dummy Data - Demo Tenant"
        Then the text "Tenant changed!" is displayed
        And change of tenant to "Dummy Data - Demo Tenant" is displayed

    @tenant_user_account-test-002
    Scenario: User account - Tenent change from Switch company - Successful tenant change for an account
        Given the user is logged in Stimulus
        When the user makes the change of tenant from Switch Company to "Dummy Data - Demo Tenant"
        And change of tenant to "Dummy Data - Demo Tenant" is displayed

@search-company
Feature: Search company

    @search-company-001
    Scenario: Search company by Company Name
        Given the user is logged in Stimulus
        And is on companies list page
        When the user searches for a company by "Company Name" with the value "JIDAN CLEANING LLC"
        Then then the search for "Company Name" with the value "JIDAN CLEANING LLC" is performed correctly

    @search-company-002
    Scenario: Search company by All
        Given the user is logged in Stimulus
        And is on companies list page
        When the user searches for a company by "All" with the value "JIDAN CLEANING LLC"
        Then then the search for "All" with the value "JIDAN CLEANING LLC" is performed correctly

    @search-company-003
    Scenario: Search company by Tags
        Given the user is logged in Stimulus
        And is on companies list page
        When the user searches for a company by "Tags" with the value "African"
        Then then the search for "Tags" with the value "African" is performed correctly

    @search-company-004
    Scenario: Search company by Tax Id No
        Given the user is logged in Stimulus
        And is on companies list page
        When the user searches for a company by "Tax ID No" with the value "DU-123456789"
        Then then the search for "Tax ID No" with the value "DU-123456789" is performed correctly

    @search-company-005
    Scenario: Search company by Description
        Given the user is logged in Stimulus
        And is on companies list page
        When the user searches for a company by "Description" with the value "commercial cleaning business"
        Then then the search for 'Description' with the value "cleaning" is performed correctly

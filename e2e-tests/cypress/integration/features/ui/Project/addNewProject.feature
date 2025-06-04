@project
Feature: Add new project

    @project-test-001
    Scenario: Successful add new project
        Given the user is logged in Stimulus
        And is on the projects page
        When the user press the new project button
        And fills the new project fields
            | title    | start_date | end_date   | description    | project_id | project_budget | keywords |
            | Stimulus | 07/12/2023 | 07/12/2023 | my description | 00033423   | 443422         | test     |
        And press the button to continue with the creation of the project
        Then the project is created correctly
        And the "Project was created" log is displayed in the Activity Log section
        Then delete the project

    @project-test-002
    Scenario Outline: Failed add new project - Required <required_field> field
        Given the user is logged in Stimulus
        And is on the projects page
        When the user press the new project button
        And fills the new project fields
            | title   | start_date   | end_date   | description   | project_id   | project_budget   | keywords   |
            | <title> | <start_date> | <end_date> | <description> | <project_id> | <project_budget> | <keywords> |
        Then Continue button is disabled
        Examples:
            | required_field | title    | start_date | end_date   | description    | project_id | project_budget | keywords | 
            | Project Budget | Stimulus | 07/12/2023 | 07/12/2023 | my description | 00033423   |                | test     | 
            | Start date     | Stimulus |            | 07/12/2023 | my description | 123123123  | 123213123      | test     | 
            | Title          |          | 07/12/2023 | 07/12/2023 | my description | 123123123  | 123213123      | test     | 

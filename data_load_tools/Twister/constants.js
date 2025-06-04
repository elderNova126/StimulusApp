let schemas = [
    {
        name: "Aramark Corporation",
        shemaName: "aramark_corporation"
    },
    {
        name: "Chop",
        shemaName: "chop"
    },
    {
        name: "Community College of Philadelphia",
        shemaName: "community_college_of_philadelphia"
    },
    {
        name: "Drexel University",
        shemaName: "drexel_university"
    },
    {
        name: "Economy League",
        shemaName: "economy_league"
    },
    {
        name: "Independence Blue Cross",
        shemaName: "independence_blue_cross"
    },
    {
        name: "Penn Medicine",
        shemaName: "penn_medicine"
    },
    {
        name: "Promptworks",
        shemaName: "promptworks"
    },
    {
        name: "Stimulus",
        shemaName: "stimulus"
    },
    {
        name: "Think Company",
        shemaName: "think_company"
    },
    {
        name: "Thomas Jefferson University Hospitals",
        shemaName: "thomas_jefferson_university_hospitals"
    },
    {
        name: "University of Pennsylvania",
        shemaName: "university_of_pennsylvania"
    }
];

let tenantTables = [
    'attachment',
    'company_evaluation',
    'company_evaluation_note',
    'company_list',
    'company_note',
    'custom_metric',
    'evaluation_template',
    'evaluation_template_custom_metrics_custom_metric',
    'event',
    'migrations',
    'notification',
    'project',
    'project_collaboration',
    'project_company',
    'project_note',
    'report',
    'saved_search',
    'scenario',
    'upload_report',
    'upload_report_errors',
    'user_profile'
]


module.exports = { schemas, tenantTables };
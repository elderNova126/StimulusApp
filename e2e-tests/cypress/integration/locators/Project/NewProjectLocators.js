module.exports = {
  SELECTORS: {
    PROJECT_ICON: '[aria-label="projects"]',
    PROJECT_BTN: 'img[src="/stimuluslogo.png"] +++ div:contains("Projects") >',
    FORM: {
      TITLE_FIELD: ':contains("Title*") + input',
      STARTDATE_TXTFLD: ':contains("Start*") +>>> input',
      ENDDATE_TXTFLD: ':contains("End") +>>> input',
      DESCRIPTION_TXTAREA: ':contains("Description")+textarea',
      PROJECTID_FIELD: ':contains("Contract Number")+input',
      PROJECTBUDGET_FIELD: ':contains("Project Budget*")+input',
      KEYWORDS_TXTFLD: ':contains("Keywords")+input',
      CONTINUE_BTN: 'button:contains("Continue")',
    },
    SKIP_BTN: 'button:contains("Skip")',
    MENUPROJECT: '#popover-trigger-project-options-button-000',
    DELETEPROJECT: 'h4:contains("Delete Project")',
    CONFIRM_BTN: 'button:contains("Confirm")',
  },
  TEXTS: {},
};

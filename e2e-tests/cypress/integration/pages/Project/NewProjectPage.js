const { SELECTORS } = require('../../locators/Project/NewProjectLocators');

class NewProjectPage {
  /***************************************************************/
  /******************** NEW PROJECT FORM *************************/
  /***************************************************************/
  inputTitleProject(company_name) {
    if (company_name) {
      cy.get(SELECTORS.FORM.TITLE_FIELD).type(company_name);
    }
  }
  inputStartDate(start_date) {
    if (start_date) {
      cy.get(SELECTORS.FORM.STARTDATE_TXTFLD).type(start_date);
    }
  }
  inputEndDate(end_date) {
    if (end_date) {
      cy.get(SELECTORS.FORM.ENDDATE_TXTFLD).type(end_date);
    }
  }
  inputDescription(description) {
    if (description) {
      cy.get(SELECTORS.FORM.DESCRIPTION_TXTAREA).type(description);
    }
  }
  inputProjectID(project_id) {
    if (project_id) {
      cy.get(SELECTORS.FORM.PROJECTID_FIELD).type(project_id);
    }
  }
  inputProjectBudget(project_budget) {
    if (project_budget) {
      cy.get(SELECTORS.FORM.PROJECTBUDGET_FIELD).type(project_budget);
    }
  }
  inputKeywords(keywords) {
    if (keywords) {
      cy.get(SELECTORS.FORM.KEYWORDS_TXTFLD).type(keywords);
    }
  }
  clickOnContinueBtn() {
    cy.get(SELECTORS.FORM.CONTINUE_BTN).click();
  }
  mouseOverOnContinueBtn() {
    cy.get(SELECTORS.FORM.CONTINUE_BTN).trigger('mouseover');
  }
  validateContinueBtnDisabled() {
    cy.get(SELECTORS.FORM.CONTINUE_BTN).should('be.disabled');
  }

  validateProject(project_name) {
    cy.contains('Projects').should('exist').and('be.visible');
    cy.contains(project_name).should('exist').and('be.visible');
  }
  skipSelectionCriteria() {
    cy.get(SELECTORS.SKIP_BTN).click();
  }
  deleteProject() {
    cy.get(SELECTORS.MENUPROJECT).click();
    cy.get(SELECTORS.DELETEPROJECT).should('be.visible').click();
    cy.get(SELECTORS.CONFIRM_BTN).click();
  }
}
export default NewProjectPage;

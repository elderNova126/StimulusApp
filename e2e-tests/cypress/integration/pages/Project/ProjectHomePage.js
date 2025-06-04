const { SELECTORS } = require('../../locators/Project/ProjectHomeLocators');

class ProjectHomePage {
  searchProject(project_name) {
    cy.get(SELECTORS.SEARCH_SECTION.SEARCH_TXTFLD).type(project_name);
    cy.get(SELECTORS.SEARCH_SECTION.SEARCH_BTN).click();
  }
  selectProjectInList(project_name) {
    cy.get(`button:contains("${project_name}")`).click();
  }
  clickOnPendingInvitesTab() {
    cy.get(SELECTORS.PENDINGINVITE_TAB).click();
  }
  clickOnAllProjectsTab() {
    cy.get(SELECTORS.ALLPROJECTS_TAB).click();
  }
  clickOnNewProjectBtn() {
    cy.get(SELECTORS.NEWPROJECT_BTN).click();
  }
}

export default ProjectHomePage;

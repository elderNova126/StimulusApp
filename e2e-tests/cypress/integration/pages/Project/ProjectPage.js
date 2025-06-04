const { SELECTORS, TEXTS } = require('../../locators/Project/ProjectLocators');

class ProjectPage {
  /***********************************************************************/
  /********************* TABS ACTIONS ************************************/
  /***********************************************************************/
  enterDetailsTab() {
    cy.get(SELECTORS.DETAILS_TAB).click();
  }

  enterSuppliersTab() {
    cy.get(SELECTORS.SUPPLIERS_TAB).click();
  }

  enterPeopleTab() {
    cy.get(SELECTORS.PEOPLE_TAB).click();
  }

  enterNotesTab() {
    cy.get(SELECTORS.NOTES_TAB).click();
  }

  enterActivityLog() {
    cy.get(SELECTORS.ACTIVITY_LOG_TAB).click();
  }

  validateProjectLoaded() {
    cy.get(SELECTORS.SKELETON_ANIMATION).should('not.exist');
  }

  /***********************************************************************/
  /********************* Details tab section *****************************/
  /***********************************************************************/
  attachFile(file_path) {
    cy.get(SELECTORS.DETAILS_SECTION.CHOOSEDOC_BTN).selectFile(file_path, { force: true });
    cy.get(SELECTORS.DETAILS_SECTION.UPLOADDOC_BTN).click();
  }

  validateDocAttached() {
    cy.get(SELECTORS.DETAILS_SECTION.MESSAGEDOC).should('contain', 'archivo');
  }

  downloadsDoc() {
    cy.get(SELECTORS.DETAILS_SECTION.FILEATTACHED).trigger('mouseover');
    cy.get(SELECTORS.DETAILS_SECTION.DOWNLOADFILE_BTN).click();
  }

  deleteDoc() {
    cy.get(SELECTORS.DETAILS_SECTION.FILEATTACHED).trigger('mouseover');
    cy.get(SELECTORS.DETAILS_SECTION.DELETEICON_BTN).click();
  }

  validateDeleteDoc() {
    cy.get(SELECTORS.DETAILS_SECTION.CHOOSEDOC).should('contain', 'Choose Doc');
  }

  /***********************************************************************/
  /********************* Suppliers tab section ***************************/
  /***********************************************************************/

  clickOnDiscoverBtn() {
    cy.get(SELECTORS.SUPPLIERS_SECTION.DISCOVER_BTN).click();
  }

  validatedCompanyInProject(company_name) {
    cy.get(`:contains("Company") +>>>> :contains("${company_name}") :contains("was") :contains("considered")`).should(
      'be.visible'
    );
  }

  /***********************************************************************/
  /********************* People tab section ******************************/
  /***********************************************************************/
  clickOnInviteUserBtn() {
    cy.get(SELECTORS.PEOPLE_SECTION.INVITEUSER).click();
  }

  inviteUser() {
    cy.get(SELECTORS.PEOPLE_SECTION.INVITE_BTN).click();
    cy.get(SELECTORS.PEOPLE_SECTION.CLOSE).click();
  }
  acceptarproject() {
    cy.get(SELECTORS.PEOPLE_SECTION.ACCEPTAR_PROJECT).click();
  }
  accessToTheProject() {
    cy.get(SELECTORS.PEOPLE_SECTION.ALLPROJECT).click();
    cy.get(SELECTORS.PEOPLE_SECTION.SEARCHPROJECT).type(TEXTS.PROJECT);
    cy.get(SELECTORS.PEOPLE_SECTION.SEARCH).click();
    cy.get(SELECTORS.PEOPLE_SECTION.LISTPROJECT).should('contain', 'Test Automation');
  }

  /***********************************************************************/
  /********************* Notes tab section *******************************/
  /***********************************************************************/

  sendNote(comment) {
    cy.get(SELECTORS.NOTES_SECTION.WRITING_COMMENT).should('be.visible').type(comment);
    cy.get(SELECTORS.NOTES_SECTION.SEND_BTN).should('be.enabled').click();
    cy.get(SELECTORS.NOTES_SECTION.SPINNER).should('not.exist');
  }

  replyComment(comment_reply) {
    cy.get(SELECTORS.NOTES_SECTION.REPLY_BTN).click();
    cy.get(SELECTORS.NOTES_SECTION.WRITING_COMMENTREPLY).type(comment_reply);
    cy.get(SELECTORS.NOTES_SECTION.SENDREPLY_BTN).click();
    cy.get(SELECTORS.NOTES_SECTION.SPINNER).should('not.exist');
  }

  editComment(comment_edited) {
    cy.get(SELECTORS.NOTES_SECTION.EDIT_BTN).click();
    cy.get(SELECTORS.NOTES_SECTION.EDITCOMMENT).clear();
    cy.get(SELECTORS.NOTES_SECTION.EDITCOMMENT).type(comment_edited);
    cy.get(SELECTORS.NOTES_SECTION.SENDEDIT_BTN).click();
    cy.get(SELECTORS.NOTES_SECTION.SPINNER).should('not.exist');
  }

  deleteComment() {
    cy.get(SELECTORS.NOTES_SECTION.DELETE_ICON).should('be.visible').click();
    cy.get(SELECTORS.NOTES_SECTION.DELETE_BTN).click();
  }

  validateNotComment() {
    cy.get(SELECTORS.NOTES_SECTION.WRITING_COMMENT).should('be.visible');
  }

  deleteProject() {
    cy.get(SELECTORS.MENUPROJECT).should('be.visible').click();
    cy.get(SELECTORS.DELETEPROJECT).should('have.css', 'cursor', 'pointer').click();
    cy.get(SELECTORS.CONFIRM_BTN).should('be.visible').click();
  }

  /***********************************************************************/
  /********************* Activity Log tab section ************************/
  /***********************************************************************/
  validateActivityLog(activity_log) {
    cy.get(SELECTORS.ACTIVITY_LOG_SECTION.LAST_ACTIVITY_LOG).should('contain', activity_log);
  }

  validateProjectName(project_name) {
    cy.contains(project_name).should('exist').and('be.visible');
    cy.contains('Project was created').should('exist').and('be.visible');
  }
}

export default ProjectPage;

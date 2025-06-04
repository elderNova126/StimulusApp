import { getVariable, setVariable } from '../../../../../utils/Context';
import HomePage from '../../../../pages/HomePage';
import ProjectHomePage from '../../../../pages/Project/ProjectHomePage';
import ProjectPage from '../../../../pages/Project/ProjectPage';
import CompaniesHomePage from '../../../../pages/Companies/CompaniesHomePage';

const {
  PROJECT_NAME,
  COMPANY_NAME,
  COMMENT_ORIGIN,
  COMMENT_REPLY,
  COMMENT_EDITED,
} = require('../../../../../utils/CommonVariables');
const projectHomePage = new ProjectHomePage();
const projectPage = new ProjectPage();
const companiesHomePage = new CompaniesHomePage();
const homePage = new HomePage();

When('the user enters a file in the details tab', () => {
  projectPage.enterDetailsTab();
  projectPage.attachFile('./cypress/fixtures/utils/archivo.pdf');
});

Then('you see the attached documents', () => {
  projectPage.validateDocAttached();
});

When('the user downloads the file', () => {
  projectPage.downloadsDoc();
});

When('the user deletes the file', () => {
  projectPage.deleteDoc();
});

Then('the file is not visible', () => {
  projectPage.validateDeleteDoc();
});

When('the user clicks on the Discover button in the Suppliers tab', () => {
  projectPage.enterSuppliersTab();
  projectPage.clickOnDiscoverBtn();
});

When('the user adds an internal company to the project', () => {
  companiesHomePage.addFilterBasicByStatus('Internal - Active');
  companiesHomePage.getNameCompany().then((company_name) => {
    setVariable(COMPANY_NAME, company_name);
  });
  let project_name = getVariable(PROJECT_NAME);
  companiesHomePage.addCompanyToProject(project_name);
});

When('the user adds an external company to the project', () => {
  companiesHomePage.addFilterBasicByStatus('External');
  companiesHomePage.getNameCompany().then((company_name) => {
    setVariable(COMPANY_NAME, company_name);
  });
  let project_name = getVariable(PROJECT_NAME);
  companiesHomePage.addCompanyToProject(project_name);
});

Then('the companies are displayed on the considered section of the Suppliers tab', () => {
  let project_name = getVariable(PROJECT_NAME);
  homePage.goProjectsSection();
  projectHomePage.searchProject(project_name);
  projectHomePage.selectProjectInList(project_name);
  projectPage.validateProjectName(project_name);
  projectPage.enterActivityLog();
  let company_name = getVariable(COMPANY_NAME);
  projectPage.validatedCompanyInProject(company_name);
});

When('the user clicks on the Invite User button in the People tab', () => {
  projectPage.enterPeopleTab();
  projectPage.clickOnInviteUserBtn();
});

When('the user invite a user', () => {
  projectPage.inviteUser();
});

And('the user logs in with the guest user', () => {
  projectPage.login();
});

And('the user enters the Pending invites tab in Projects', () => {
  homePage.goProjectsSection();
  projectHomePage.clickOnPendingInvitesTab();
});

And('the user accepts the request', () => {
  projectPage.acceptarproject();
});

Then('the user has access to the project', () => {
  projectPage.accessToTheProject();
});

And('the user enters the comment {string} in the Notes tab', (comment) => {
  setVariable(COMMENT_ORIGIN, comment);
  projectPage.enterNotesTab();
  projectPage.sendNote(comment);
});

And('the user responds to the comment with {string}', (comment_reply) => {
  setVariable(COMMENT_REPLY, comment_reply);
  projectPage.replyComment(comment_reply);
});

And('the user edits the comment with {string}', (comment_edited) => {
  setVariable(COMMENT_EDITED, comment_edited);
  projectPage.editComment(comment_edited);
});

And('the user deletes the comments', () => {
  projectPage.deleteComment();
});

Then('the user sees the comment entered', () => {
  let comment_origin = getVariable(COMMENT_ORIGIN);
  cy.contains(comment_origin).should('exist').and('be.visible');
});

Then('the edited comment is displayed correctly', () => {
  let comment_edited = getVariable(COMMENT_EDITED);
  cy.contains(comment_edited).should('exist').and('be.visible');
});

Then('the users reply comment is displayed', () => {
  let comment_reply = getVariable(COMMENT_REPLY);
  cy.contains(comment_reply).should('exist').and('be.visible');
});

Then('you do not see any comments', () => {
  projectPage.validateNotComment();
});

Then('the {string} log is displayed in the Activity Log section', (activiy_log) => {
  projectPage.enterActivityLog();
  let company_name = getVariable(COMPANY_NAME);
  let log = activiy_log.replace('{company}', company_name);
  cy.log(log);
  projectPage.validateActivityLog(log);
});

Then('delete the project', () => {
  projectPage.deleteProject();
});

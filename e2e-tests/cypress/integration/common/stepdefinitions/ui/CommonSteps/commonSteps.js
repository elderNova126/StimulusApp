import LoginPage from '../../../../pages/Login/LoginPage';
const loginPage = new LoginPage();

Given('the user is logged in Stimulus', () => {
  cy.visit('/');
  loginPage.login(Cypress.env('CYPRESS_LOGIN_EMAIL'), Cypress.env('CYPRESS_LOGIN_PASSWORD'));
});

Then('the text {string} is displayed', (text) => {
  cy.contains(text).should('exist').and('be.visible');
});

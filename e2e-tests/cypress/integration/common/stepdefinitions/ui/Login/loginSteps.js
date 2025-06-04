import LoginPage from '../../../../pages/Login/LoginPage';
const loginPage = new LoginPage();

Given('the user is on the login page of Stimulus', () => {
  cy.visit('/');
});

When('enters the valid email and password', () => {
  loginPage.inputEmail(Cypress.env('CYPRESS_LOGIN_EMAIL'));
  loginPage.inputPassword(Cypress.env('CYPRESS_LOGIN_PASSWORD'));
});

When('enters the email {string} and password {string}', (email, password) => {
  loginPage.inputEmail(email);
  loginPage.inputPassword(password);
});

And('press the Login button', () => {
  loginPage.clickOnLoginBtn();
});

Then('is redirected to the home page', () => {
  loginPage.validatePageHomeByUrl();
});

const { SELECTORS } = require('../../locators/Login/LoginLocators');

class LoginPage {
  inputEmail(email) {
    cy.get(SELECTORS.EMAIL_TXTBOX).type(email);
  }

  inputPassword(password) {
    cy.get(SELECTORS.PASSWORD_TXTBOX).type(password);
  }

  clickOnLoginBtn() {
    cy.get(SELECTORS.LOGIN_BUTTON).click();
  }

  clickOnSignupBtn() {
    cy.get(SELECTORS.SIGNUPNOW).click();
  }

  login(email, password) {
    this.inputEmail(email);
    this.inputPassword(password);
    this.clickOnLoginBtn();
  }

  validatePageHomeByUrl() {
    cy.get(SELECTORS.HOMELOGO).should('be.visible');
    cy.url().should('include', '/dashboard');
  }
}

export default LoginPage;

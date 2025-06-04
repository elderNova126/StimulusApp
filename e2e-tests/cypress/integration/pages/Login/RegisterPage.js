const { SELECTORS } = require('../../locators/Login/RegisterLocators');

class RegisterPage {
  /*********************************************************/
  /************** VERIFICATION CODE FORM *******************/
  /*********************************************************/
  sendVerificationCode(email) {
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.EMAILFIELD).type(email);
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.SENDVERIFICATIONCODE).click();
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.VERIFICATIONCODE_TXTFLD).should('be.visible');
  }
  verifyCode(verification_code) {
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.VERIFICATIONCODE_TXTFLD).type(verification_code);
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.VERIFICATIONCODE_BTN).click();
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.CHANGEEMAIL_BTN).should('be.visible');
  }

  /**********************************************************/
  /******************** USER REGISTER FORM ******************/
  /**********************************************************/
  resendVerificationCode() {
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.RESENDVERIFICATIONCODE).click();
  }

  inputPassword(password) {
    cy.get(SELECTORS.FORM.NEWPASSWORD_FIELD).type(password);
  }
  inputConfirmPassword(confirm_password) {
    cy.get(SELECTORS.FORM.CONFIRMNEWPASSWORD_FIELD).type(confirm_password);
  }
  inputFirstName(first_name) {
    cy.get(SELECTORS.FORM.FIRSTNAME_FIELD).type(first_name);
  }
  inputLastName(last_name) {
    cy.get(SELECTORS.FORM.LASTNAME_FIELD).type(last_name);
  }
  inputTitle(title) {
    cy.get(SELECTORS.FORM.TITLE_FIELD).type(title);
  }
  inputCompanyName(company_name) {
    cy.get(SELECTORS.FORM.COMPANYNAME_FIELD).type(company_name);
  }
  clickOnCreateBtn() {
    cy.get(SELECTORS.FORM.CONTINUE_BTN).click();
  }
  /***************************************************************/
  /************************* VALIDATIONS *************************/

  validateVisitHome() {
    cy.get(SELECTORS.VALIDATETEXT).should('contain', 'All Companies');
  }
  validateCreateBtnDisabled() {
    cy.get(SELECTORS.CREATEUSER_BTN).should('be.disabled');
  }
  validate() {
    cy.get(SELECTORS.VALIDATETEXT).should('be.visible');
  }
  emailFieldIsVisible() {
    cy.get(SELECTORS.VERIFICATIONCODE_FORM.EMAILFIELD).should('be.visible');
  }
  /****************************************************************/
}

export default RegisterPage;

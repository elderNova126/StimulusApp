import RegisterPage from '../../../../pages/Login/RegisterPage';
import UserManagementPage from '../../../../pages/Tenant/UserManagementPage';
import LoginPage from '../../../../pages/Login/LoginPage';
import { setVariable, getVariable } from '../../../../../utils/Context';
import HomePage from '../../../../pages/HomePage';
const { GUEST_EMAIL, GUEST_PASSWORD } = require('../../../../../utils/CommonVariables');
const loginPage = new LoginPage();
const homePage = new HomePage();
const registerPage = new RegisterPage();
const userManagementPage = new UserManagementPage();

And('the user enters the User Management page', () => {
  homePage.enterUserManagement();
});

And('sends a user registration invitation', () => {
  cy.createRandomEmail().then(({ body }) => {
    const guest_email = body.email;
    cy.wrap(userManagementPage.inviteNewUser(guest_email)).then(() => {
      setVariable(GUEST_EMAIL, guest_email);
      userManagementPage.sendemail();
      homePage.logOut();
    });
  });
});

And('sends an invitation to a new user', () => {
  cy.createRandomEmail().then(({ body }) => {
    const guest_email = body.email;
    cy.wrap(userManagementPage.inviteNewUser(guest_email)).then(() => {
      setVariable(GUEST_EMAIL, guest_email);
      userManagementPage.sendemail();
    });
  });
});

When('the guest user enters the registration page', () => {
  loginPage.clickOnSignupBtn();
  registerPage.emailFieldIsVisible();
});

And('confirms email with verification code', () => {
  const guest_email = getVariable(GUEST_EMAIL);

  registerPage.sendVerificationCode(guest_email);

  // Use recursion to continually check the inbox
  function checkInbox(retryCount = 0) {
    cy.getInboxMessages(guest_email).then((response) => {
      // We're getting two messages: one a general invite, and another one with the code
      // The second one always arrives after the first one, so we can check the length
      if (response && response.body && response.body.length > 1) {
        const message = response.body[1].body_text;
        cy.getVerificationCode(message).then((verification_code) => {
          registerPage.verifyCode(verification_code);
        });
      } else {
        // Retry after 10 seconds if there are fewer than two messages.
        // If we've waiting for three times or more, then resend the verification code.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(10000).then(() => {
          if (retryCount >= 2) {
            registerPage.resendVerificationCode();
            // Resend the verification code then reset our count and keep retrying indefinitely
            checkInbox(0);
          } else {
            // If we have not hit our limit yet, simply increase the count and retry
            checkInbox(retryCount + 1);
          }
        });
      }
    });
  }

  // Kick off initial inbox check
  checkInbox();
});

And('registers with the following data', (datatable) => {
  const data = datatable.hashes()[0];
  setVariable(GUEST_PASSWORD, data.password);

  registerPage.inputPassword(data.password);
  registerPage.inputConfirmPassword(data.confirm_password);
  registerPage.inputFirstName(data.first_name);
  registerPage.inputLastName(data.last_name);
  registerPage.inputTitle(data.title);
  registerPage.inputCompanyName(data.company_name);
});

And('confirms registration', () => {
  registerPage.clickOnCreateBtn();
  cy.url().should('contain', 'https://app');
});

Then('the guest user logs in', () => {
  const email = getVariable(GUEST_EMAIL);
  const password = getVariable(GUEST_PASSWORD);

  cy.session('guestUserSession', () => {
    cy.visit('/');
    loginPage.login(email, password);
    loginPage.validatePageHomeByUrl();
  });
});

Then('the Create button is disabled', () => {
  registerPage.validateCreateBtnDisabled();
});

And('the incorrect verification code message is displayed.', () => {
  registerPage.validateMessageErrorCode();
});

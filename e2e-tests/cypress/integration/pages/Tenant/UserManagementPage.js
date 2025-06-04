const { SELECTORS } = require('../../locators/Tenant/UserManagementLocators');

class UserManagementPage {
  inviteNewUser(email) {
    cy.get(SELECTORS.USEREMAIL).should('be.visible');
    cy.get(SELECTORS.USEREMAIL).type(email);
  }

  sendemail() {
    cy.get(SELECTORS.SENDINVITE).should('be.visible').should('be.enabled').click();
  }

  validateEmailInPendingInvitation(email) {
    cy.reload();
    cy.xpath(SELECTORS.PENDING_INVITATIONS_SECTION.INVITATIONS_LIST).contains(email).should('be.visible');
  }
}

export default UserManagementPage;

const { SELECTORS } = require('../locators/HomeLocators');

class HomePage {
  /************************************************************/
  /************************* MENU ACTIONS  ********************/
  /************************************************************/
  goCompaniesSection() {
    cy.get(SELECTORS.MENU.ICON).should('be.visible');
    cy.get(SELECTORS.MENU.COMPANIES_ALL_SECTION).should('be.visible').click({ force: true });
  }
  goProjectsSection() {
    cy.get(SELECTORS.MENU.ICON).should('be.visible');
    cy.get(SELECTORS.MENU.PROJECT_SECTION).should('be.visible').click({ force: true });
  }
  goReportsSection() {
    cy.get(SELECTORS.MENU.ICON).should('be.visible');
    cy.get(SELECTORS.MENU.REPORTS_SECTION).should('be.visible').click({ force: true });
  }
  goDashboardSection() {
    cy.get(SELECTORS.MENU.ICON).should('be.visible');
    cy.get(SELECTORS.MENU.DASHBOARD_SECTION).should('be.visible').click({ force: true });
  }

  /****************************************************************/
  /************************* SETTINGS ACTIONS  ********************/
  /****************************************************************/
  enterUserManagement() {
    cy.get(SELECTORS.SETTING).click();
    cy.get(SELECTORS.TENANT_MENU_SETTINGS.USERMANAGEMENT).click();
  }
  enterUserAccount() {
    cy.get(SELECTORS.USER_MENU_SETTINGS.USER_MENU_AVATAR).click();
    cy.get(SELECTORS.USER_MENU_SETTINGS.ACCOUNT).as('btn').click();
  }
  enterTenantAccount() {
    cy.get(SELECTORS.SETTING).click();
    cy.get(SELECTORS.TENANT_MENU_SETTINGS.ACCOUNT).as('btn').click();
    cy.get(SELECTORS.SKELETON_ANIMATION).should('not.exist');
  }
  switchTenant(tenant_name) {
    cy.get(SELECTORS.USER_MENU_SETTINGS.USER_MENU_AVATAR).prev().click();
    cy.get(`[data-cy="${tenant_name}"]`).should('be.visible').click();
    cy.intercept('GET', '/dashboard').as('pageRefresh');
    cy.wait('@pageRefresh');
    cy.get(SELECTORS.SKELETON_ANIMATION).should('not.exist');
  }

  logOut() {
    cy.get(SELECTORS.PROFILE).click();
    cy.get(SELECTORS.LOGOUT).click();
    cy.get(SELECTORS.LOGOUT_BTN).click();
  }
}

export default HomePage;

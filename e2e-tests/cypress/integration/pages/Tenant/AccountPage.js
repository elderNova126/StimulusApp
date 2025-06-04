class AccountPage {
  validateTenantNameVisible(tenant_name) {
    cy.get(`p:contains("Company Name") +:contains("${tenant_name}")`).should('be.visible');
  }
}

export default AccountPage;

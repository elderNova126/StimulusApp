class UserSettingsPage {
  changeTenant(tenant_name) {
    cy.get(`:contains("Linked Companies")++>:contains("${tenant_name}")`).click();
  }
}

export default UserSettingsPage;
